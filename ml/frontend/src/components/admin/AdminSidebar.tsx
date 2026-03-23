import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminSidebar component provides navigation for the admin section
 */
const AdminSidebar: React.FC = () => {
  const { currentUser } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 ${isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800'}`;

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen">
      <div className="p-4 border-b border-blue-800">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-blue-300 mt-1">
          {currentUser?.first_name} {currentUser?.last_name}
        </p>
      </div>

      <nav className="mt-6">
        <NavLink to="/admin" end className={linkClass}>
          <span className="ml-2">Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <span className="ml-2">User Management</span>
        </NavLink>
        <NavLink to="/admin/loan-configuration" className={linkClass}>
          <span className="ml-2">Loan Configuration</span>
        </NavLink>
        <NavLink to="/admin/loan-applications" className={linkClass}>
          <span className="ml-2">Loan Applications</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
