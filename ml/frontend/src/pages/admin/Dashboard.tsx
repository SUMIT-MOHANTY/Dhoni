import React, { useState, useEffect } from 'react';

interface Stats {
  total_users: number;
  total_loans: number;
  pending_loans: number;
  approved_loans: number;
  rejected_loans: number;
  total_loan_amount: number;
}

/**
 * Dashboard page displays key metrics and statistics for administrators
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/admin/stats/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-10">No data available</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">User Statistics</h2>
          <p className="text-3xl font-bold text-blue-700">{stats.total_users}</p>
          <p className="text-gray-600">Total registered users</p>
        </div>

        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Loans</h2>
          <p className="text-3xl font-bold text-green-700">{stats.total_loans}</p>
          <p className="text-gray-600">All loan applications</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Review</h2>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending_loans}</p>
          <p className="text-gray-600">Loan applications awaiting review</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Approved Loans</h2>
          <p className="text-3xl font-bold text-green-600">{stats.approved_loans}</p>
          <p className="text-gray-600">Successfully approved applications</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Rejected Loans</h2>
          <p className="text-3xl font-bold text-red-600">{stats.rejected_loans}</p>
          <p className="text-gray-600">Declined loan applications</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Loan Volume</h2>
          <p className="text-3xl font-bold text-purple-700">${stats.total_loan_amount.toLocaleString()}</p>
          <p className="text-gray-600">Cumulative loan amount</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/loan-applications" className="bg-blue-600 text-white p-4 rounded flex items-center justify-center hover:bg-blue-700">
            Review Pending Applications
          </a>
          <a href="/admin/loan-configuration" className="bg-green-600 text-white p-4 rounded flex items-center justify-center hover:bg-green-700">
            Configure Loan Parameters
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
