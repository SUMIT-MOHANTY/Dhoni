import React from 'react';
import LoanConfigForm from '../../components/admin/LoanConfigForm';

/**
 * LoanConfiguration page displays the loan parameters configuration interface
 */
const LoanConfiguration: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Loan Configuration</h1>

      <p className="text-gray-600 mb-6">
        Configure the loan parameters that control the loan application process.
        These settings determine the limits and conditions for all loan applications.
      </p>

      <LoanConfigForm />
    </div>
  );
};

export default LoanConfiguration;
