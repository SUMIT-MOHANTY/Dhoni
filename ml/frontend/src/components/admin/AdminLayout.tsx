import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminLayout component serves as a wrapper for all admin pages
 * It ensures only users with admin role can access the pages
 * and provides consistent layout with sidebar navigation
 */
const AdminLayout: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect non-admin users to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
