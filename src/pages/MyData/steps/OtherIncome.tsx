import React from 'react';
import { IndianRupee, Info } from 'lucide-react';

interface OtherIncomeProps {
  data: {
    capitalGains?: number;
    rentalIncome?: number;
    interestIncome?: number;
    otherIncome?: number;
  };
  updateData: (data: any) => void;
}

const OtherIncome: React.FC<OtherIncomeProps> = ({ data, updateData }) => {
  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value === '' ? '' : Number(value)
    });
  };

  const incomeTypes = [
    {
      id: 'capitalGains',
      label: 'Capital Gains',
      description: 'Income from profits after selling shares or stock market investments'
    },
    {
      id: 'rentalIncome',
      label: 'Rental Income',
      description: 'Income from renting out property'
    },
    {
      id: 'interestIncome',
      label: 'Interest Income',
      description: 'Income from bank savings accounts, deposits, etc.'
    },
    {
      id: 'otherIncome',
      label: 'Other Income',
      description: 'Any other taxable income not covered above'
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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {incomeTypes.map((income) => (
            <div key={income.id}>
              <label htmlFor={income.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {income.label}
              </label>
              <div className="mt-2">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id={income.id}
                    value={data[income.id as keyof typeof data] || ''}
                    onChange={(e) => handleChange(income.id, e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">/year</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {income.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Other Income Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Other Income
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sum of all additional income sources
            </p>
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(calculateTotal())}
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Important Information
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Include all additional sources of income for accurate tax calculation. Capital gains should be reported after considering indexation benefits where applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherIncome; 