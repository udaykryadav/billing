import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CustName: '',
    CustAddress: '',
    CustPAN: '',
    CustGST: '',
    isActive: 'Y'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!formData.CustName) {
      setError("Customer Name is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create customer');
      }
      
      // Navigate back to customers list
      navigate('/master/customers');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginTop: '6px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333'
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>Add New Customer</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '800px' }}>
        <div>
          <label style={labelStyle}>Customer Name</label>
          <input 
            type="text" 
            name="CustName"
            value={formData.CustName}
            onChange={handleInputChange}
            style={{...inputStyle, border: '2px solid #2bc4ff', backgroundColor: '#fff'}} 
          />
        </div>
        
        <div>
          <label style={labelStyle}>Customer Address</label>
          <input 
            type="text" 
            name="CustAddress"
            value={formData.CustAddress}
            onChange={handleInputChange}
            style={inputStyle} 
          />
        </div>
        
        <div>
          <label style={labelStyle}>Customer Pan Card Number</label>
          <input 
            type="text" 
            name="CustPAN"
            value={formData.CustPAN}
            onChange={handleInputChange}
            style={inputStyle} 
          />
        </div>
        
        <div>
          <label style={labelStyle}>Customer GST Number</label>
          <input 
            type="text" 
            name="CustGST"
            value={formData.CustGST}
            onChange={handleInputChange}
            style={inputStyle} 
          />
        </div>
        
        <div>
          <label style={labelStyle}>Customer Status</label>
          <select 
            name="isActive"
            value={formData.isActive}
            onChange={handleInputChange}
            style={{...inputStyle, outline: 'none', appearance: 'none', background: '#f5f5f5 url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px top 50%", backgroundSize: "12px auto"'}}
          >
            <option value="Y">Active</option>
            <option value="N">In-Active</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => navigate('/master/customers')}
          style={{ padding: '8px 24px', border: '1px solid #ff4d4f', backgroundColor: 'transparent', color: '#ff4d4f', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cancel
        </button>
        <button 
          onClick={handleCreate}
          disabled={loading}
          style={{ padding: '8px 24px', border: 'none', backgroundColor: '#2c2e5b', color: 'white', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default AddCustomer;
