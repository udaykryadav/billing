import React, { useState, useEffect } from 'react';

const BillingHome = () => {
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, [isCustomerModalOpen]);

  const getProp = (obj, prop1, prop2) => obj ? (obj[prop1] !== undefined ? obj[prop1] : obj[prop2]) : '';

  return (
    <div style={{ position: 'relative' }}>
      <h1 className="page-title" style={{ margin: 0, marginBottom: '30px', fontWeight: 'bold', fontSize: '24px' }}>Billing</h1>

      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Customer Details</h2>
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
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', flexDirection: 'column', marginTop: '30px', paddingBottom: '40px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Items</h2>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
            <button 
              onClick={() => {}}
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
                {customers.map(customer => {
                  const custName = getProp(customer, 'custname', 'CustName');
                  const isActive = getProp(customer, 'isactive', 'isActive');
                  return (
                    <div 
                      key={getProp(customer, 'custid', 'CustID')} 
                      className="module-card" 
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerModalOpen(false);
                      }}
                      style={{ display: 'flex', flexDirection: 'column', height: 'auto', minHeight: '120px', padding: '20px', cursor: 'pointer' }}
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
                          backgroundColor: isActive === 'Y' ? '#d4edda' : '#f8d7da',
                          color: isActive === 'Y' ? '#155724' : '#721c24'
                        }}>
                          {isActive === 'Y' ? 'Active' : 'In-Active'}
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
    </div>
  );
};

export default BillingHome;
