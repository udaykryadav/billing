import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MasterPage from './pages/MasterPage';
import CustomerMasterHome from './pages/CustomerMasterHome';

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
          
          <Route path="billing" element={
            <div>
              <h1 className="page-title">Billing</h1>
              <p>Billss </p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
