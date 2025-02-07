import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { 
  CreditCard, 
  IndianRupee, 
  Building2, 
  Wallet, 
  Receipt, 
  ArrowLeft, 
  ArrowRight,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import StepRenderer from './components/StepRenderer';

// Step components
import PersonalDetails from './steps/PersonalDetails';
import SalaryIncome from './steps/SalaryIncome';
import OtherIncome from './steps/OtherIncome';
import Deductions80C from './steps/Deductions80C';
import OtherDeductions from './steps/OtherDeductions';

interface StepComponentProps {
  data: any;
  updateData: (data: any) => void;
}

interface Step {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  component: React.FC<StepComponentProps>;
  requiredFields: string[];
}

const steps: Step[] = [
  {
    id: 'personal',
    name: 'Personal Details',
    icon: CreditCard,
    description: 'Your PAN and basic details',
    component: PersonalDetails,
    requiredFields: ['pan', 'age'],
  },
  {
    id: 'salary',
    name: 'Income from Salary',
    icon: IndianRupee,
    description: 'Basic salary and allowances',
    component: SalaryIncome,
    requiredFields: [],
  },
  {
    id: 'other-income',
    name: 'Other Income',
    icon: Building2,
    description: 'Capital gains, rental, and interest income',
    component: OtherIncome,
    requiredFields: [],
  },
  {
    id: '80c',
    name: '80C Deductions',
    icon: Wallet,
    description: 'PPF, ELSS, EPF & more',
    component: Deductions80C,
    requiredFields: [],
  },
  {
    id: 'other-deductions',
    name: 'Other Deductions',
    icon: Receipt,
    description: 'NPS, medical, education & home loan',
    component: OtherDeductions,
    requiredFields: [],
  },
];

const MyData = () => {
  const { user } = useUser();
  const userId = user?.id;

  const getStorageKey = (key: string) => `${userId}_${key}`;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    if (!userId) return {};
    const savedData = localStorage.getItem(getStorageKey('taxFormData'));
    return savedData ? JSON.parse(savedData) : {};
  });

  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    if (!userId) return [];
    const savedProgress = localStorage.getItem(getStorageKey('taxFormProgress'));
    return savedProgress ? JSON.parse(savedProgress) : [];
  });

  // Load data when user logs in
  useEffect(() => {
    if (userId) {
      const savedData = localStorage.getItem(getStorageKey('taxFormData'));
      const savedProgress = localStorage.getItem(getStorageKey('taxFormProgress'));
      
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
      if (savedProgress) {
        setCompletedSteps(JSON.parse(savedProgress));
      }
    }
  }, [userId]);

  // Save progress whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(getStorageKey('taxFormProgress'), JSON.stringify(completedSteps));
    }
  }, [completedSteps, userId]);

  // Auto-save form data whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(getStorageKey('taxFormData'), JSON.stringify(formData));
    }
  }, [formData, userId]);

  const isStepComplete = (stepId: string, data: any) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || !data) return false;

    // If there are required fields, check if they're all filled
    if (step.requiredFields.length > 0) {
      return step.requiredFields.every(field => {
        const value = data[field];
        return value !== undefined && value !== '' && value !== null;
      });
    }

    // If no required fields, check if any field has data
    return Object.values(data).some(value => 
      value !== undefined && value !== '' && value !== null && value !== 0
    );
  };

  const updateFormData = (stepId: string, data: any) => {
    const newFormData = {
      ...formData,
      [stepId]: data
    };
    setFormData(newFormData);

    // Update completed steps based on actual data
    const isComplete = isStepComplete(stepId, data);
    if (isComplete && !completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    } else if (!isComplete && completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    }
  };

  const calculateProgress = () => {
    const completedCount = steps.filter(step => 
      isStepComplete(step.id, formData[step.id])
    ).length;
    return (completedCount / steps.length) * 100;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAll = () => {
    if (!userId) {
      toast.error('Please log in to save your data');
      return;
    }

    try {
      // Save all data with timestamps
      const dataToSave = {
        formData,
        completedSteps,
        lastUpdated: new Date().toISOString(),
        userId
      };

      localStorage.setItem(getStorageKey('taxFormData'), JSON.stringify(formData));
      localStorage.setItem(getStorageKey('taxFormProgress'), JSON.stringify(completedSteps));
      localStorage.setItem(getStorageKey('taxFormMeta'), JSON.stringify({
        lastUpdated: dataToSave.lastUpdated,
        userId: dataToSave.userId
      }));

      toast.success('All data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  const calculateTaxableIncome = () => {
    const totalDeductions = (formData['80c'] ? Object.values(formData['80c']).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) : 0) +
      (formData['other-deductions'] ? Object.values(formData['other-deductions']).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) : 0);
    return Math.max(0, 500000 - totalDeductions); // Example base income
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tax Information
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Complete your tax information step by step
              </p>
              {userId && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Last saved: {
                    (() => {
                      const meta = localStorage.getItem(getStorageKey('taxFormMeta'));
                      if (meta) {
                        const { lastUpdated } = JSON.parse(meta);
                        return new Date(lastUpdated).toLocaleString();
                      }
                      return 'Never';
                    })()
                  }
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Progress:
              </span>
              <span className="text-lg font-bold text-primary">
                {Math.round(calculateProgress())}%
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-3 transition-all duration-500 shadow-lg"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Start</span>
              <span>Personal Details</span>
              <span>Deductions</span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Show warning if not logged in */}
        {!userId && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
              <AlertCircle className="h-5 w-5" />
              <p>Please log in to save your tax information.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Tabs Navigation */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <nav className="divide-y divide-gray-200 dark:divide-gray-700">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = isStepComplete(step.id, formData[step.id]);

                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full flex items-center p-4 transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${
                        isActive 
                          ? 'bg-white/10' 
                          : isCompleted
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Icon className={`h-5 w-5 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                        )}
                      </div>
                      <div className="ml-3 text-left flex-1">
                        <p className={`text-sm font-medium ${
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {step.name}
                        </p>
                        <p className={`text-xs ${
                          isActive 
                            ? 'text-white/80' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                      {!isCompleted && step.requiredFields.length > 0 && (
                        <AlertCircle className="h-4 w-4 text-amber-500 ml-2" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={handleSaveAll}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:from-primary/90 hover:to-primary/70"
              >
                <Save className="h-5 w-5 mr-2" />
                Save All Data
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {steps[currentStep].name}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {steps[currentStep].description}
                </p>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StepRenderer
                      currentStep={currentStep}
                      formData={formData}
                      updateFormData={updateFormData}
                      stepId={steps[currentStep].id}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                
                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleSaveAll}
                    className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-lg transition-all duration-200 hover:shadow-lg hover:from-primary/90 hover:to-primary/70"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Complete & Save
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-lg transition-all duration-200 hover:shadow-lg hover:from-primary/90 hover:to-primary/70"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyData;
