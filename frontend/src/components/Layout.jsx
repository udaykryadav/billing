import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Layout Blueprint
 * Injects a static left-locked sidebar whilst mapping active screen logic inside `Outlet`.
 */
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
