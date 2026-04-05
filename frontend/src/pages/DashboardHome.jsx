import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/bills')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then(data => {
        setBills(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredBills = bills.filter(bill => {
    return bill.invoiceid && bill.invoiceid.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ position: 'relative' }}>
      <h1 className="page-title" style={{ margin: 0, marginBottom: '20px', fontWeight: 'bold', fontSize: '24px' }}>Dashboard</h1>

      <div style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search by Invoice ID" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '300px', padding: '12px 16px', borderRadius: '4px', border: '1px solid #e0e0e0', backgroundColor: '#fcfcfc', fontSize: '14px', outline: 'none' }}
        />
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
        {loading && <div style={{ padding: '20px' }}>Loading generated invoices...</div>}
        {error && <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>}

        {!loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#2c2e5b', color: 'white' }}>
              <tr>
                <th style={{ padding: '16px 20px', fontWeight: 'bold', fontSize: '14px' }}>Invoice ID</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold', fontSize: '14px' }}>Customer name</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold', fontSize: '14px' }}>Item name (s)</th>
                <th style={{ padding: '16px 20px', fontWeight: 'bold', fontSize: '14px' }}>Amount</th>
                <th style={{ padding: '16px 20px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? filteredBills.map((bill, index) => (
                <tr key={bill.invoiceid} style={{ borderBottom: index === filteredBills.length - 1 ? 'none' : '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                  <td style={{ padding: '20px', fontWeight: 'bold', fontSize: '15px' }}>{bill.invoiceid}</td>
                  <td style={{ padding: '20px', fontWeight: 'bold', fontSize: '15px' }}>{bill.customername}</td>
                  <td style={{ padding: '20px', fontWeight: 'bold', fontSize: '15px' }}>{bill.itemnames}</td>
                  <td style={{ padding: '20px', fontWeight: 'bold', fontSize: '15px' }}>{parseFloat(bill.totalamount).toFixed(0)}</td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => navigate(`/invoice/${bill.invoiceid}`)}
                      style={{ padding: '8px 24px', border: 'none', background: '#2c2e5b', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                      View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
