import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ItemMasterHome = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/items')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getProp = (obj, prop1, prop2) => obj[prop1] !== undefined ? obj[prop1] : obj[prop2];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title" style={{ margin: 0, textTransform: 'uppercase', fontSize: '24px' }}>Items</h1>
        <button 
          onClick={() => navigate('/master/items/add')}
          style={{ 
          padding: '8px 16px', 
          borderRadius: '6px', 
          border: '1px solid #e0e0e0', 
          background: '#f8f9fa', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          color: '#333'
        }}>
          <span style={{ background: '#2c3e50', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>+</span>
          ADD
        </button>
      </div>

      {loading && <div>Loading items...</div>}
      {error && <div style={{ color: '#d32f2f', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>Error: {error}</div>}

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {items.map(item => {
          const itemName = getProp(item, 'itemname', 'ItemName');
          const isActive = getProp(item, 'isactive', 'isActive');
          
          return (
            <div key={getProp(item, 'itemid', 'ItemID')} className="module-card" style={{ display: 'flex', flexDirection: 'column', height: 'auto', minHeight: '120px', padding: '20px', cursor: 'default' }}>
              <div className="module-card-title" style={{ flexGrow: 1, fontSize: '18px', marginBottom: '20px' }}>
                {itemName}
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
        {items.length === 0 && !loading && !error && <div>No items found.</div>}
      </div>
    </div>
  );
};

export default ItemMasterHome;
