import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MasterPage from './pages/MasterPage';
import CustomerMasterHome from './pages/CustomerMasterHome';
import AddCustomer from './pages/AddCustomer';
import ItemMasterHome from './pages/ItemMasterHome';
import AddItem from './pages/AddItem';
import BillingHome from './pages/BillingHome';
import DashboardHome from './pages/DashboardHome';
import InvoiceDetails from './pages/InvoiceDetails';

/**
 * Main Application Router Component
 * Orchestrates the root paths splitting logic natively between:
 * - Dashboard (Aggregating invoice histories natively)
 * - Master Directories (CRUD routes spanning Customers and Item components)
 * - Active Billing Core (Transactional invoice engineering)
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard Aggregation Routes */}
          <Route index element={<DashboardHome />} />
          <Route path="invoice/:id" element={<InvoiceDetails />} />
          
          {/* Internal Application Data State Layers */}
          <Route path="master" element={<MasterPage />} />
          <Route path="master/customers" element={<CustomerMasterHome />} />
          <Route path="master/customers/add" element={<AddCustomer />} />
          <Route path="master/items" element={<ItemMasterHome />} />
          <Route path="master/items/add" element={<AddItem />} />
          
          {/* Transaction Generator Form */}
          <Route path="billing" element={<BillingHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
