import React, { useState } from 'react';
import { IndianRupee, Info } from 'lucide-react';

interface OtherDeductionsProps {
  data: {
    nps?: number;
    medicalPremium?: number;
    educationLoanInterest?: number;
    homeLoanInterest?: number;
    hraExemption?: {
      rentPaid: number;
      basicSalary: number;
      hraReceived: number;
      isMetroCity: boolean;
    };
  };
  updateData: (data: any) => void;
}

const OtherDeductions: React.FC<OtherDeductionsProps> = ({ data, updateData }) => {
  const [showHRACalculator, setShowHRACalculator] = useState(false);

  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value === '' ? '' : Number(value)
    });
  };

  const handleHRAChange = (field: string, value: string | boolean) => {
    updateData({
      ...data,
      hraExemption: {
        ...data.hraExemption,
        [field]: typeof value === 'boolean' ? value : (value === '' ? '' : Number(value))
      }
    });
  };

  const calculateHRAExemption = () => {
    const { rentPaid = 0, basicSalary = 0, hraReceived = 0, isMetroCity = false } = data.hraExemption || {};
    
    // Calculate exemption based on the minimum of:
    // 1. Actual HRA received
    // 2. Rent paid - 10% of basic salary
    // 3. 50% (metro) or 40% (non-metro) of basic salary
    
    const rentMinusBasic = Math.max(0, rentPaid - (0.1 * basicSalary));
    const percentageOfBasic = basicSalary * (isMetroCity ? 0.5 : 0.4);
    
    return Math.min(
      hraReceived,
      rentMinusBasic,
      percentageOfBasic
    );
  };

  const deductionTypes = [
    {
      id: 'nps',
      label: 'National Pension Scheme (NPS)',
      description: 'Additional deduction under section 80CCD(1B)',
      maxLimit: 50000
    },
    {
      id: 'medicalPremium',
      label: 'Medical Insurance Premium',
      description: 'Health insurance premium under section 80D',
      maxLimit: 25000
    },
    {
      id: 'educationLoanInterest',
      label: 'Education Loan Interest',
      description: 'Interest paid on education loan under section 80E',
      maxLimit: null
    },
    {
      id: 'homeLoanInterest',
      label: 'Home Loan Interest',
      description: 'Interest paid on home loan under section 24B',
      maxLimit: 200000
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const fillDemoData = () => {
    const demoData = {
      nps: 50000,
      medicalPremium: 25000,
      educationLoanInterest: 35000,
      homeLoanInterest: 200000,
      hraExemption: {
        rentPaid: 240000,
        basicSalary: 720000,
        hraReceived: 360000,
        isMetroCity: true
      }
    };
    updateData(demoData);
  };

  return (
    <div className="space-y-6">
      {/* Regular Deductions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {deductionTypes.map((deduction) => (
            <div key={deduction.id}>
              <div className="flex items-center justify-between">
                <label htmlFor={deduction.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {deduction.label}
                </label>
                {deduction.maxLimit && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Max: {formatCurrency(deduction.maxLimit)}
                  </span>
                )}
              </div>
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

      {/* HRA Exemption Calculator */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              HRA Exemption Calculator
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Calculate your House Rent Allowance exemption
            </p>
          </div>
          <button
            onClick={() => setShowHRACalculator(!showHRACalculator)}
            className="text-primary hover:text-primary/80"
          >
            {showHRACalculator ? 'Hide Calculator' : 'Show Calculator'}
          </button>
        </div>

        {showHRACalculator && (
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="rentPaid" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Annual Rent Paid
              </label>
              <div className="mt-2">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="rentPaid"
                    value={data.hraExemption?.rentPaid || ''}
                    onChange={(e) => handleHRAChange('rentPaid', e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Basic Salary + DA
              </label>
              <div className="mt-2">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="basicSalary"
                    value={data.hraExemption?.basicSalary || ''}
                    onChange={(e) => handleHRAChange('basicSalary', e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="hraReceived" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                HRA Received
              </label>
              <div className="mt-2">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="hraReceived"
                    value={data.hraExemption?.hraReceived || ''}
                    onChange={(e) => handleHRAChange('hraReceived', e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isMetroCity"
                checked={data.hraExemption?.isMetroCity || false}
                onChange={(e) => handleHRAChange('isMetroCity', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isMetroCity" className="text-sm text-gray-700 dark:text-gray-300">
                Living in Metro City (Delhi, Mumbai, Kolkata, Chennai)
              </label>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated HRA Exemption
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(calculateHRAExemption())}
                </span>
              </div>
            </div>
          </div>
        )}
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
              These deductions are in addition to Section 80C deductions. Each deduction has its own separate limit and conditions. 
              HRA exemption is calculated based on the minimum of actual HRA received, rent paid minus 10% of basic salary, and 50% (metro) or 40% (non-metro) of basic salary.
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

export default OtherDeductions; 