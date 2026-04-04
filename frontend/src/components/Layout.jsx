import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="app-container">
      {/* Top darker blue bar */}
      <div className="topbar"></div>
      
      <div className="main-wrapper">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
