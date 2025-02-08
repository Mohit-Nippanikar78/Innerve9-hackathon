import React from 'react';
import { IndianRupee, Wallet, Building, Briefcase, Home, Info } from 'lucide-react';

interface Deductions80CProps {
  data: {
    ppf?: number;
    elss?: number;
    epf?: number;
    nsc?: number;
    homeLoanPrincipal?: number;
  };
  updateData: (data: any) => void;
}

const Deductions80C: React.FC<Deductions80CProps> = ({ data, updateData }) => {
  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value === '' ? '' : Number(value)
    });
  };

  const deductionTypes = [
    {
      id: 'ppf',
      label: 'Public Provident Fund (PPF)',
      description: 'Long-term savings scheme with tax benefits'
    },
    {
      id: 'elss',
      label: 'Equity Linked Savings Scheme (ELSS)',
      description: 'Tax-saving mutual funds with 3-year lock-in'
    },
    {
      id: 'epf',
      label: 'Employee Provident Fund (EPF)',
      description: 'Retirement benefit scheme for salaried employees'
    },
    {
      id: 'nsc',
      label: 'National Savings Certificate (NSC)',
      description: 'Government-backed savings certificate'
    },
    {
      id: 'homeLoanPrincipal',
      label: 'Home Loan Principal Repayment',
      description: 'Principal amount paid towards home loan'
    }
  ];

  const calculateTotal = () => {
    return Object.values(data).reduce((sum, value) => sum + (Number(value) || 0), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const maxLimit = 150000;
  const totalDeductions = calculateTotal();
  const remainingLimit = Math.max(0, maxLimit - totalDeductions);

  const fillDemoData = () => {
    const demoData = {
      ppf: 50000,
      elss: 25000,
      epf: 36000,
      nsc: 15000,
      homeLoanPrincipal: 24000
    };
    updateData(demoData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {deductionTypes.map((deduction) => (
            <div key={deduction.id}>
              <label htmlFor={deduction.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {deduction.label}
              </label>
              <div className="mt-2">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id={deduction.id}
                    value={data[deduction.id as keyof typeof data] || ''}
                    onChange={(e) => handleChange(deduction.id, e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">/year</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {deduction.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Deductions Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total 80C Deductions
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Maximum limit: {formatCurrency(maxLimit)}
              </p>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalDeductions)}
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Limit Utilization
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {((totalDeductions / maxLimit) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  totalDeductions > maxLimit ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((totalDeductions / maxLimit) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Remaining limit: {formatCurrency(remainingLimit)}
            </p>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Section 80C Deductions
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              The maximum deduction allowed under section 80C is ₹1,50,000 per financial year. 
              This includes all investments and expenses listed above.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={fillDemoData}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Fill Demo Data
        </button>
      </div>
    </div>
  );
};

export default Deductions80C; 