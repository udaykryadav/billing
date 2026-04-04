import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, FileText } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink to="/master" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Database size={20} />
        <span>Master</span>
      </NavLink>
      
      <NavLink to="/billing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={20} />
        <span>Billing</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
