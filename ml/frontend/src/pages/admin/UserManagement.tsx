import React from 'react';
import UsersList from '../../components/admin/UsersList';

/**
 * UserManagement page displays the user management interface
 */
const UserManagement: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <p className="text-gray-600 mb-6">
        Manage user accounts and roles. Only administrators can modify user roles.
      </p>

      <UsersList />
    </div>
  );
};

export default UserManagement;
