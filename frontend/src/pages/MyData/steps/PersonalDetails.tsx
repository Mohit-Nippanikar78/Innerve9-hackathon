import React from 'react';
import { CreditCard, Info } from 'lucide-react';

interface PersonalDetailsProps {
  data: {
    pan?: string;
    age?: number;
  };
  updateData: (data: any) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ data, updateData }) => {
  const handleChange = (field: string, value: string | number) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  const validatePAN = (pan: string) => {
    // PAN format: ABCDE1234F
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const fillDemoData = () => {
    const demoData = {
      pan: 'ABCDE1234F',
      age: 32
    };
    updateData(demoData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            PAN Details
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="pan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PAN Number
            </label>
            <input
              type="text"
              id="pan"
              value={data.pan || ''}
              onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your PAN number"
              maxLength={10}
            />
            {data.pan && !validatePAN(data.pan) && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Please enter a valid PAN number (Format: ABCDE1234F)
              </p>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={data.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your age"
              min={0}
              max={120}
            />
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Important Note
            </h4>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Your PAN details will be used to fetch your income and investment details automatically. 
              Please ensure you enter the correct PAN number.
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

export default PersonalDetails; 