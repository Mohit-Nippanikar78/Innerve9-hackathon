import React from 'react';
import { IndianRupee, Info } from 'lucide-react';

interface SalaryIncomeProps {
  data: {
    basic?: number;
    da?: number;
    hra?: number;
    lta?: number;
    bonus?: number;
    otherAllowances?: number;
  };
  updateData: (data: any) => void;
}

const SalaryIncome: React.FC<SalaryIncomeProps> = ({ data, updateData }) => {
  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value === '' ? '' : Number(value)
    });
  };

  const salaryComponents = [
    {
      id: 'basic',
      label: 'Basic Salary',
      description: 'Your base salary component'
    },
    {
      id: 'da',
      label: 'Dearness Allowance (DA)',
      description: 'Additional allowance based on inflation'
    },
    {
      id: 'hra',
      label: 'House Rent Allowance (HRA)',
      description: 'Allowance for rental accommodation'
    },
    {
      id: 'lta',
      label: 'Leave Travel Allowance (LTA)',
      description: 'Allowance for travel expenses'
    },
    {
      id: 'bonus',
      label: 'Bonus',
      description: 'Performance bonus and other incentives'
    },
    {
      id: 'otherAllowances',
      label: 'Other Allowances',
      description: 'Any additional allowances'
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

  const fillDemoData = () => {
    const demoData = {
      basic: 720000,
      da: 144000,
      hra: 360000,
      lta: 60000,
      bonus: 180000,
      otherAllowances: 120000
    };
    updateData(demoData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {salaryComponents.map((component) => (
            <div key={component.id}>
              <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {component.label}
              </label>
              <div className="mt-2">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id={component.id}
                    value={data[component.id as keyof typeof data] || ''}
                    onChange={(e) => handleChange(component.id, e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">/year</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {component.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Salary Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Annual Salary
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sum of all salary components
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
              Enter your annual salary components as per your salary slip. These details will be used to calculate your taxable income and applicable deductions.
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

export default SalaryIncome; 