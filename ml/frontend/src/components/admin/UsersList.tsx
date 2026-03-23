import React, { useState } from 'react';
import { User, UserRole } from '../../types/user';
import { useUsers } from '../../hooks/useUsers';

/**
 * UsersList component displays and manages user accounts
 */
const UsersList: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleChange, setRoleChange] = useState<UserRole | ''>('');

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Refresh user list
      await fetchUsers();
      setEditingUser(null);
      setRoleChange('');
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Joined Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{user.id}</td>
              <td className="py-3 px-4">{user.first_name} {user.last_name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.role}</td>
              <td className="py-3 px-4">{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</td>
              <td className="py-3 px-4">
                {editingUser?.id === user.id ? (
                  <div className="flex items-center space-x-2">
                    <select
                      className="border rounded p-1"
                      value={roleChange}
                      onChange={(e) => setRoleChange(e.target.value as UserRole)}
                    >
                      <option value="">Select Role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => roleChange && handleRoleChange(user.id, roleChange as UserRole)}
                      disabled={!roleChange}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 px-2 py-1 rounded"
                      onClick={() => {
                        setEditingUser(null);
                        setRoleChange('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditingUser(user);
                      setRoleChange(user.role);
                    }}
                  >
                    Edit Role
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
