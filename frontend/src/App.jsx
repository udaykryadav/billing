import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MasterPage from './pages/MasterPage';
import CustomerMasterHome from './pages/CustomerMasterHome';
import AddCustomer from './pages/AddCustomer';
import ItemMasterHome from './pages/ItemMasterHome';
import AddItem from './pages/AddItem';
import BillingHome from './pages/BillingHome';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p>Welcome to the Billing System. Select a module from the sidebar.</p>
            </div>
          } />
          
          <Route path="master" element={<MasterPage />} />
          <Route path="master/customers" element={<CustomerMasterHome />} />
          <Route path="master/customers/add" element={<AddCustomer />} />
          <Route path="master/items" element={<ItemMasterHome />} />
          <Route path="master/items/add" element={<AddItem />} />
          
          <Route path="billing" element={<BillingHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
