import React, { useState } from 'react';
import { Calculator, IndianRupee, Info } from 'lucide-react';

interface SalaryInputs {
  basic: number;
  hra: number;
  lta: number;
  da: number;
  bonus: number;
  otherAllowances: number;
}

interface DeductionInputs {
  ppf: number;
  elss: number;
  nsc: number;
  epf: number;
  homeLoanPrinciple80C: number;
  medicalPremiums: number;
  educationLoanInterest: number;
  nps: number;
  savingsAccountInterest: number;
  homeLoanInterest24B: number;
  metroPolitanCity: boolean;
  rentPaid: number;
}

const TaxCalculator = () => {
  const [age, setAge] = useState<number>(30);
  const [salaryInputs, setSalaryInputs] = useState<SalaryInputs>({
    basic: 0,
    hra: 0,
    lta: 0,
    da: 0,
    bonus: 0,
    otherAllowances: 0
  });

  const [deductionInputs, setDeductionInputs] = useState<DeductionInputs>({
    ppf: 0,
    elss: 0,
    nsc: 0,
    epf: 0,
    homeLoanPrinciple80C: 0,
    medicalPremiums: 0,
    educationLoanInterest: 0,
    nps: 0,
    savingsAccountInterest: 0,
    homeLoanInterest24B: 0,
    metroPolitanCity: true,
    rentPaid: 0
  });

  // Tax calculation functions
  const calculateGrossSalary = (): number => {
    return Object.values(salaryInputs).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const calculate80CDeductions = (): number => {
    const sum80C = deductionInputs.ppf + 
                  deductionInputs.elss + 
                  deductionInputs.nsc + 
                  deductionInputs.epf + 
                  deductionInputs.homeLoanPrinciple80C;
    return Math.min(sum80C, 150000);
  };

  const calculateHRAExemption = (): number => {
    const basicDa = salaryInputs.basic + salaryInputs.da;
    const hra = salaryInputs.hra;
    const rentPaid = deductionInputs.rentPaid;
    const isMetro = deductionInputs.metroPolitanCity;

    const hraLimit = basicDa * (isMetro ? 0.5 : 0.4);
    const rentMinus10Percent = Math.max(rentPaid - (basicDa * 0.1), 0);

    return Math.min(hra, hraLimit, rentMinus10Percent);
  };

  const calculateTotalDeductions = (): number => {
    const standardDeduction = 50000;
    const hraExemption = calculateHRAExemption();

    return (calculate80CDeductions() +
            standardDeduction +
            deductionInputs.medicalPremiums +
            deductionInputs.educationLoanInterest +
            deductionInputs.nps +
            deductionInputs.savingsAccountInterest +
            deductionInputs.homeLoanInterest24B +
            hraExemption);
  };

  const calculateTaxableIncome = (): number => {
    return calculateGrossSalary() - calculateTotalDeductions();
  };

  const calculateTaxOldRegime = (taxableIncome: number): number => {
    if (taxableIncome <= 500000) return 0;

    let tax = 0;
    const slabs = age < 60 ? [250000, 500000, 1000000] : 
                 age < 80 ? [300000, 500000, 1000000] : 
                           [500000, 1000000];
    const rates = age < 80 ? [0.05, 0.2, 0.3] : [0.2, 0.3];

    for (let i = 0; i < slabs.length; i++) {
      if (taxableIncome > slabs[i]) {
        const taxableAmount = Math.min(
          taxableIncome - slabs[i],
          i === 0 ? slabs[i] : slabs[i] - slabs[i - 1]
        );
        tax += taxableAmount * rates[i];
      }
    }

    return tax;
  };

  const calculateTaxNewRegime = (grossSalary: number): number => {
    const standardDeduction = 75000;
    const taxableIncome = grossSalary - standardDeduction;
    
    if (taxableIncome <= 1200000) return 0;
    
    const slabs = [400000, 800000, 1200000, 1600000, 2000000, 2400000];
    const rates = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
    
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < slabs.length; i++) {
      if (remainingIncome > slabs[i]) {
        const taxableAmount = Math.min(
          remainingIncome - slabs[i],
          i === 0 ? slabs[i] : slabs[i] - slabs[i - 1]
        );
        tax += taxableAmount * rates[i];
        remainingIncome -= taxableAmount;
      }
    }

    if (taxableIncome - tax < 1200000) {
      tax = taxableIncome - 1200000;
    }

    return tax;
  };

  const calculateEducationCess = (tax: number): number => {
    return tax * 0.04;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate final values
  const grossSalary = calculateGrossSalary();
  const taxableIncome = calculateTaxableIncome();
  const oldRegimeTax = calculateTaxOldRegime(taxableIncome);
  const newRegimeTax = calculateTaxNewRegime(grossSalary);
  const oldRegimeCess = calculateEducationCess(oldRegimeTax);
  const newRegimeCess = calculateEducationCess(newRegimeTax);
  const totalOldRegimeTax = oldRegimeTax + oldRegimeCess;
  const totalNewRegimeTax = newRegimeTax + newRegimeCess;

  // Add this function near the other calculation functions
  const fillDemoData = () => {
    // Demo salary data based on a typical mid-level professional
    setSalaryInputs({
      basic: 720000,    // 60,000 per month
      hra: 360000,      // 50% of basic
      lta: 50000,
      da: 144000,       // 20% of basic
      bonus: 150000,
      otherAllowances: 120000
    });

    // Demo deduction data with common investment patterns
    setDeductionInputs({
      ppf: 50000,
      elss: 25000,
      nsc: 10000,
      epf: 30000,
      homeLoanPrinciple80C: 40000,
      medicalPremiums: 20000,
      educationLoanInterest: 15000,
      nps: 50000,
      savingsAccountInterest: 10000,
      homeLoanInterest24B: 200000,
      metroPolitanCity: true,
      rentPaid: 240000  // 20,000 per month
    });

    // Set a typical age
    setAge(32);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Tax Calculator
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Compare your tax liability under both old and new tax regimes
                </p>
              </div>
            </div>
            <button
              onClick={fillDemoData}
              className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              <span>Fill Demo Data</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Basic Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your age"
                  />
                </div>
              </div>
            </div>

            {/* Salary Components */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Salary Components
              </h2>
              <div className="grid gap-6">
                {Object.entries(salaryInputs).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setSalaryInputs({
                          ...salaryInputs,
                          [key]: Number(e.target.value) || 0
                        })}
                        className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Deductions & Exemptions
              </h2>
              <div className="grid gap-6">
                {Object.entries(deductionInputs).map(([key, value]) => {
                  if (key === 'metroPolitanCity') {
                    return (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setDeductionInputs({
                            ...deductionInputs,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Living in Metro City
                        </label>
                      </div>
                    );
                  }
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setDeductionInputs({
                            ...deductionInputs,
                            [key]: Number(e.target.value) || 0
                          })}
                          className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  );
                })}
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
                      {formatCurrency(grossSalary)}
                    </span>
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
                </div>

                {/* Taxable Income */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Taxable Income</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(taxableIncome)}
                    </span>
                  </div>
                </div>

                {/* Old Regime Tax */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Old Tax Regime</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Base Tax</span>
                      <span>{formatCurrency(oldRegimeTax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Education Cess (4%)</span>
                      <span>{formatCurrency(oldRegimeCess)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span>Total Tax</span>
                      <span className="text-primary">{formatCurrency(totalOldRegimeTax)}</span>
                    </div>
                  </div>
                </div>

                {/* New Regime Tax */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">New Tax Regime</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Base Tax</span>
                      <span>{formatCurrency(newRegimeTax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Education Cess (4%)</span>
                      <span>{formatCurrency(newRegimeCess)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span>Total Tax</span>
                      <span className="text-primary">{formatCurrency(totalNewRegimeTax)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Regime */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Recommended Regime
                      </h4>
                      <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                        {totalNewRegimeTax < totalOldRegimeTax ? 'New' : 'Old'} regime is better for you.
                        You can save {formatCurrency(Math.abs(totalNewRegimeTax - totalOldRegimeTax))}
                      </p>
                    </div>
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