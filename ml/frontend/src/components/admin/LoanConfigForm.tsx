import React, { useState, useEffect } from 'react';

interface LoanConfig {
  min_loan_amount: number;
  max_loan_amount: number;
  min_term_months: number;
  max_term_months: number;
  base_interest_rate: number;
  risk_adjustment_factor: number;
}

/**
 * LoanConfigForm component provides a form for configuring loan parameters
 */
const LoanConfigForm: React.FC = () => {
  const [config, setConfig] = useState<LoanConfig>({
    min_loan_amount: 1000,
    max_loan_amount: 50000,
    min_term_months: 6,
    max_term_months: 60,
    base_interest_rate: 5.0,
    risk_adjustment_factor: 0.5
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch current loan configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/v1/loan-config/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch loan configuration');
        }

        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: parseFloat(value)
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/v1/loan-config/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Failed to update loan configuration');
      }

      setSuccessMessage('Loan configuration updated successfully');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading configuration...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold">Loan Amount Limits</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Minimum Loan Amount ($)</label>
            <input
              type="number"
              name="min_loan_amount"
              value={config.min_loan_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="0"
              step="100"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Maximum Loan Amount ($)</label>
            <input
              type="number"
              name="max_loan_amount"
              value={config.max_loan_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min={config.min_loan_amount}
              step="1000"
              required
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold">Loan Term Limits</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Minimum Term (months)</label>
            <input
              type="number"
              name="min_term_months"
              value={config.min_term_months}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Maximum Term (months)</label>
            <input
              type="number"
              name="max_term_months"
              value={config.max_term_months}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min={config.min_term_months}
              required
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold">Interest Rate Configuration</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Base Interest Rate (%)</label>
            <input
              type="number"
              name="base_interest_rate"
              value={config.base_interest_rate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="0"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Risk Adjustment Factor</label>
            <input
              type="number"
              name="risk_adjustment_factor"
              value={config.risk_adjustment_factor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="0"
              step="0.1"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            disabled={saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanConfigForm;
