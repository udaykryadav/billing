import React, { useState, useEffect } from 'react';

const BillingHome = () => {
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Array of { item: {...}, qty: 1 }
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState(null);

  useEffect(() => {
    if (isCustomerModalOpen && customers.length === 0) {
      setLoading(true);
      fetch('http://localhost:3000/api/customers')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch customers');
          return res.json();
        })
        .then(data => {
          setCustomers(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isCustomerModalOpen, customers.length]);

  useEffect(() => {
    if (isItemModalOpen && allItems.length === 0) {
      setItemsLoading(true);
      fetch('http://localhost:3000/api/items')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch items');
          return res.json();
        })
        .then(data => {
          setAllItems(data);
          setItemsLoading(false);
        })
        .catch(err => {
          setItemsError(err.message);
          setItemsLoading(false);
        });
    }
  }, [isItemModalOpen, allItems.length]);

  const getProp = (obj, prop1, prop2) => obj ? (obj[prop1] !== undefined ? obj[prop1] : obj[prop2]) : '';

  const handleUpdateQty = (itemData, delta) => {
    if (generatedInvoiceId) return; // Block updates if invoice locked
    const itemId = getProp(itemData, 'itemid', 'ItemID');
    setSelectedItems(prev => {
      const existing = prev.find(si => getProp(si.item, 'itemid', 'ItemID') === itemId);
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter(si => getProp(si.item, 'itemid', 'ItemID') !== itemId);
        return prev.map(si => getProp(si.item, 'itemid', 'ItemID') === itemId ? { ...si, qty: newQty } : si);
      } else if (delta > 0) {
        return [...prev, { item: itemData, qty: 1 }];
      }
      return prev;
    });
  };

  const calculateSubTotal = () => {
    let subTotal = 0;
    selectedItems.forEach(si => {
      const price = parseFloat(getProp(si.item, 'itemprice', 'ItemPrice')) || 0;
      subTotal += price * si.qty;
    });
    return subTotal;
  };

  const getGstDetails = () => {
    const subTotal = calculateSubTotal();
    const custGst = getProp(selectedCustomer, 'custgst', 'CustGST');
    const hasGst = custGst && custGst.trim() !== '';
    const gstAmount = hasGst ? 0 : subTotal * 0.18;
    const finalTotal = subTotal + gstAmount;

    return { subTotal, hasGst, gstAmount, finalTotal };
  };

  const QuantityControl = ({ itemData, qty }) => (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1a237e', borderRadius: '4px', overflow: 'hidden' }}>
      <button 
        onClick={(e) => { e.stopPropagation(); handleUpdateQty(itemData, -1); }}
        style={{ background: 'transparent', border: 'none', color: '#1a237e', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
      <span style={{ padding: '4px 10px', borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); handleUpdateQty(itemData, 1); }}
        style={{ background: 'transparent', border: 'none', color: '#1a237e', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
    </div>
  );

  const handleCreateBill = async () => {
    if (!selectedCustomer || selectedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const { finalTotal } = getGstDetails();
      
      const payload = {
        CustID: getProp(selectedCustomer, 'custid', 'CustID'),
        TotalAmount: finalTotal,
        items: selectedItems.map(si => ({
          ItemID: getProp(si.item, 'itemid', 'ItemID'),
          Quantity: si.qty,
          PriceAtSale: parseFloat(getProp(si.item, 'itemprice', 'ItemPrice')) || 0
        }))
      };

      const response = await fetch('http://localhost:3000/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         throw new Error(`Failed to create Bill!`);
      }

      const resData = await response.json();
      setGeneratedInvoiceId(resData.invoiceId);
    } catch (err) {
      console.error(err);
      alert('There was an error trying to push this invoice. Check connection logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBill = () => {
    setGeneratedInvoiceId(null);
    setSelectedCustomer(null);
    setSelectedItems([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <h1 className="page-title" style={{ margin: 0, marginBottom: '30px', fontWeight: 'bold', fontSize: '24px' }}>Billing</h1>

      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Customer Details</h2>
          {generatedInvoiceId && <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Invoice ID: {generatedInvoiceId}</div>}
        </div>
        
        {selectedCustomer ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>Name</span> <span>: <b>{getProp(selectedCustomer, 'custname', 'CustName')}</b></span></div>
            <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>Address</span> <span>: <b>{getProp(selectedCustomer, 'custaddress', 'CustAddress')}</b></span></div>
            <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>Pan Card</span> <span>: <b>{getProp(selectedCustomer, 'custpan', 'CustPAN')}</b></span></div>
            <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>GST Num</span> <span>: <b>{getProp(selectedCustomer, 'custgst', 'CustGST')}</b></span></div>
          </div>
        ) : (
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
            <button 
              onClick={() => setCustomerModalOpen(true)}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '6px', 
                border: 'none', 
                background: '#ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                color: '#1a237e'
              }}>
              <span style={{ background: '#1a237e', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>+</span>
              ADD
            </button>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', flexDirection: 'column', marginTop: '30px', paddingBottom: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Items</h2>
            {(selectedItems.length > 0 && !generatedInvoiceId) && (
              <button 
                onClick={() => setItemModalOpen(true)}
                style={{ padding: '6px 12px', border: 'none', background: '#1a237e', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >+ ADD MORE</button>
            )}
          </div>

          {selectedItems.length === 0 ? (
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
              <button 
                onClick={() => setItemModalOpen(true)}
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  background: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  color: '#1a237e'
                }}>
                <span style={{ background: '#1a237e', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>+</span>
                ADD
              </button>
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', fontSize: '14px' }}>
                <div style={{ flex: 2 }}>Name</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Quantity</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
              </div>
              
              {selectedItems.map((si, index) => {
                const itemName = getProp(si.item, 'itemname', 'ItemName');
                const price = parseFloat(getProp(si.item, 'itemprice', 'ItemPrice')) || 0;
                const totalItemPrice = price * si.qty;
                return (
                  <div key={index} style={{ display: 'flex', padding: '15px 0', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 2, fontSize: '16px' }}>{itemName}</div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      {generatedInvoiceId ? (
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{si.qty}</span>
                      ) : (
                        <QuantityControl itemData={si.item} qty={si.qty} />
                      )}
                    </div>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>{totalItemPrice.toFixed(0)}</div>
                  </div>
                );
              })}

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                {(() => {
                  const { subTotal, hasGst, gstAmount, finalTotal } = getGstDetails();
                  return (
                    <div style={{ width: '100%', maxWidth: '300px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                        <span>Sub Total</span>
                        <span>{subTotal.toFixed(0)}</span>
                      </div>
                      {!hasGst && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
                          <span>GST (18%)</span>
                          <span>{gstAmount.toFixed(0)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', fontWeight: 'bold', fontSize: '18px' }}>
                        <span>Total</span>
                        <span>{finalTotal.toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  {generatedInvoiceId ? (
                     <button 
                       onClick={handleNewBill}
                       style={{ padding: '8px 24px', border: 'none', background: '#2c2e5b', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                       Start New Bill
                     </button>
                  ) : (
                    <>
                      <button 
                      onClick={() => { setSelectedCustomer(null); setSelectedItems([]) }}
                      style={{ padding: '8px 24px', border: '1px solid #ff4d4f', color: '#ff4d4f', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Cancel
                      </button>
                      <button 
                       disabled={isSubmitting}
                       onClick={handleCreateBill}
                       style={{ padding: '8px 24px', border: 'none', background: '#2c2e5b', color: 'white', borderRadius: '4px', cursor: isSubmitting ? 'wait' : 'pointer', fontWeight: 'bold', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Select Customer</h2>
              <button 
                onClick={() => setCustomerModalOpen(false)}
                style={{ padding: '6px 16px', border: '1px solid #ff4d4f', color: '#ff4d4f', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1 }}>
              {loading && <div>Loading customers...</div>}
              {error && <div style={{ color: 'red' }}>Error: {error}</div>}
              
              <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {[...customers]
                  .sort((a, b) => {
                    const aActive = getProp(a, 'isactive', 'isActive') === 'Y' ? 1 : 0;
                    const bActive = getProp(b, 'isactive', 'isActive') === 'Y' ? 1 : 0;
                    return bActive - aActive; // Show active first
                  })
                  .map(customer => {
                  const custName = getProp(customer, 'custname', 'CustName');
                  const isActive = getProp(customer, 'isactive', 'isActive');
                  const isActiveBool = isActive === 'Y';
                  
                  return (
                    <div 
                      key={getProp(customer, 'custid', 'CustID')} 
                      className="module-card" 
                      onClick={() => {
                        if (isActiveBool) {
                          setSelectedCustomer(customer);
                          setCustomerModalOpen(false);
                        }
                      }}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: 'auto', 
                        minHeight: '120px', 
                        padding: '20px', 
                        cursor: isActiveBool ? 'pointer' : 'not-allowed',
                        backgroundColor: isActiveBool ? '#ffffff' : '#eaeaea',
                        opacity: isActiveBool ? 1 : 0.8
                      }}
                    >
                      <div className="module-card-title" style={{ flexGrow: 1, fontSize: '18px', marginBottom: '20px' }}>
                        {custName}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: isActiveBool ? '#d4edda' : '#f8d7da',
                          color: isActiveBool ? '#155724' : '#721c24'
                        }}>
                          {isActiveBool ? 'Active' : 'In-Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {isItemModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Select Items</h2>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1 }}>
              {itemsLoading && <div>Loading items...</div>}
              {itemsError && <div style={{ color: 'red' }}>Error: {itemsError}</div>}
              
              <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {[...allItems]
                  .sort((a, b) => {
                    const aActive = getProp(a, 'isactive', 'isActive') === 'Y' ? 1 : 0;
                    const bActive = getProp(b, 'isactive', 'isActive') === 'Y' ? 1 : 0;
                    return bActive - aActive; // Show active first
                  })
                  .map(item => {
                  const itemName = getProp(item, 'itemname', 'ItemName');
                  const itemId = getProp(item, 'itemid', 'ItemID');
                  const isActive = getProp(item, 'isactive', 'isActive');
                  const isActiveBool = isActive === 'Y';
                  
                  const selectedMatch = selectedItems.find(si => getProp(si.item, 'itemid', 'ItemID') === itemId);
                  const activeQty = selectedMatch ? selectedMatch.qty : 0;

                  return (
                    <div 
                      key={itemId} 
                      className="module-card" 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: 'auto', 
                        minHeight: '100px', 
                        padding: '16px', 
                        backgroundColor: isActiveBool ? '#ffffff' : '#eaeaea',
                        opacity: isActiveBool ? 1 : 0.8
                      }}
                    >
                      <div className="module-card-title" style={{ flexGrow: 1, fontSize: '16px', marginBottom: '15px' }}>
                        {itemName}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                        {!isActiveBool ? (
                           <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#f8d7da', color: '#721c24' }}>
                           In-Active
                         </span>
                        ) : activeQty > 0 ? (
                          <QuantityControl itemData={item} qty={activeQty} />
                        ) : (
                          <button 
                            onClick={() => handleUpdateQty(item, 1)}
                            style={{ 
                              padding: '6px 16px', 
                              borderRadius: '4px', 
                              border: '1px solid #1a237e', 
                              background: 'transparent',
                              color: '#1a237e',
                              cursor: 'pointer', 
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid #e0e0e0' }}>
               <button 
                onClick={() => { setSelectedItems([]); setItemModalOpen(false); }}
                style={{ padding: '8px 24px', border: '1px solid #ff4d4f', color: '#ff4d4f', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
              <button 
                onClick={() => setItemModalOpen(false)}
                style={{ padding: '8px 24px', border: 'none', background: '#1a237e', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {selectedItems.length > 0 ? 'Confirm Selection' : 'Close'}   
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingHome;
