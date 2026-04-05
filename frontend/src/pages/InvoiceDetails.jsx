import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/bills/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Invoice not found or server error');
        return res.json();
      })
      .then(data => {
        setBill(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: '40px' }}>Loading Invoice Details...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>Error: {error}</div>;
  if (!bill) return null;

  const getGstDetails = () => {
    let subTotal = 0;
    bill.items.forEach(si => {
      const price = parseFloat(si.priceatsale) || 0;
      subTotal += price * si.quantity;
    });
    
    const hasGst = bill.custgst && bill.custgst.trim() !== '';
    const gstAmount = hasGst ? 0 : subTotal * 0.18;
    const finalTotal = subTotal + gstAmount;

    return { subTotal, hasGst, gstAmount, finalTotal };
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #1a237e', backgroundColor: 'transparent', color: '#1a237e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
        >&#8592;</button>
        <h1 className="page-title" style={{ margin: 0, fontWeight: 'bold', fontSize: '24px' }}>Invoice Details</h1>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', flexDirection: 'column', paddingBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Customer Details</h2>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Invoice ID: {bill.invoiceid}</div>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>Name</span> <span>: <b>{bill.custname}</b></span></div>
          <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>Address</span> <span>: <b>{bill.custaddress}</b></span></div>
          <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>Pan Card</span> <span>: <b>{bill.custpan}</b></span></div>
          <div style={{ display: 'flex', gap: '10px' }}><span style={{ minWidth: '80px' }}>GST Num</span> <span>: <b>{bill.custgst}</b></span></div>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', flexDirection: 'column', marginTop: '30px', paddingBottom: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Items</h2>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', fontSize: '14px' }}>
            <div style={{ flex: 2 }}>Name</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Amount</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
          </div>
          
          {bill.items.map((si, index) => {
            const price = parseFloat(si.priceatsale) || 0;
            const totalItemPrice = price * si.quantity;
            return (
              <div key={index} style={{ display: 'flex', padding: '15px 0', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ flex: 2, fontSize: '16px' }}>{si.itemname}</div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{si.quantity}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
