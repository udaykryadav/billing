import React from 'react';
import { Link } from 'react-router-dom';

const MasterPage = () => {
  return (
    <div>
      <h1 className="page-title">Master</h1>
      
      <div className="card-grid">
        <Link to="/master/customers" className="module-card">
          <div className="module-card-title">Customer</div>
          <div className="module-card-desc">Read or Create customer data</div>
        </Link>

        <Link to="/master/items" className="module-card">
          <div className="module-card-title">Items</div>
          <div className="module-card-desc">Read or Create items data</div>
        </Link>
      </div>
    </div>
  );
};

export default MasterPage;
