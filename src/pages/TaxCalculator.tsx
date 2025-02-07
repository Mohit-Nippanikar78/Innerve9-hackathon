import React, { useState } from 'react';
import { Calculator, IndianRupee } from 'lucide-react';

const TaxCalculator = () => {
  const [income, setIncome] = useState<number>(0);
  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    nps: 0,
    homeLoanInterest: 0,
    others: 0
  });

  const calculateTotalDeductions = () => {
    return Object.values(deductions).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const calculateTaxableIncome = () => {
    return Math.max(0, income - calculateTotalDeductions());
  };

  const calculateTax = () => {
    const taxableIncome = calculateTaxableIncome();
    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 750000) {
      tax = 12500 + (taxableIncome - 500000) * 0.10;
    } else if (taxableIncome <= 1000000) {
      tax = 37500 + (taxableIncome - 750000) * 0.15;
    } else if (taxableIncome <= 1250000) {
      tax = 75000 + (taxableIncome - 1000000) * 0.20;
    } else if (taxableIncome <= 1500000) {
      tax = 125000 + (taxableIncome - 1250000) * 0.25;
    } else {
      tax = 187500 + (taxableIncome - 1500000) * 0.30;
    }

    return tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDeductionChange = (key: keyof typeof deductions, value: string) => {
    setDeductions(prev => ({
      ...prev,
      [key]: Number(value) || 0
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tax Calculator
            </h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Calculate your income tax based on the new tax regime
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Income Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Annual Income
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value) || 0)}
                  className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your annual income"
                />
              </div>
            </div>

            {/* Deductions Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Deductions
              </h2>
              <div className="grid gap-6">
                {[
                  { key: 'section80C', label: 'Section 80C (PPF, ELSS, etc.)', max: 150000 },
                  { key: 'section80D', label: 'Section 80D (Health Insurance)', max: 25000 },
                  { key: 'nps', label: 'NPS Contribution', max: 50000 },
                  { key: 'homeLoanInterest', label: 'Home Loan Interest', max: 200000 },
                  { key: 'others', label: 'Other Deductions', max: null }
                ].map((deduction) => (
                  <div key={deduction.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {deduction.label}
                      {deduction.max && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {formatCurrency(deduction.max)})
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={deductions[deduction.key as keyof typeof deductions]}
                        onChange={(e) => handleDeductionChange(deduction.key as keyof typeof deductions, e.target.value)}
                        className="block w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tax Calculation Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg sticky top-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tax Summary
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Gross Income */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Gross Income</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(income)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Total Deductions */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Deductions</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      - {formatCurrency(calculateTotalDeductions())}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${(calculateTotalDeductions() / income) * 100}%` }} />
                  </div>
                </div>

                {/* Taxable Income */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Taxable Income</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(calculateTaxableIncome())}
                    </span>
                  </div>
                </div>

                {/* Tax Calculation */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Estimated Tax</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(calculateTax())}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    * Based on New Tax Regime
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tax Breakdown</h3>
                  <div className="space-y-1">
                    {[
                      { label: '0 - 2.5L', rate: '0%' },
                      { label: '2.5L - 5L', rate: '5%' },
                      { label: '5L - 7.5L', rate: '10%' },
                      { label: '7.5L - 10L', rate: '15%' },
                      { label: '10L - 12.5L', rate: '20%' },
                      { label: '12.5L - 15L', rate: '25%' },
                      { label: 'Above 15L', rate: '30%' }
                    ].map((slab) => (
                      <div key={slab.label} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{slab.label}</span>
                        <span className="text-gray-900 dark:text-white">{slab.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator; 