import React from 'react';
import PersonalDetails from '../steps/PersonalDetails';
import SalaryIncome from '../steps/SalaryIncome';
import OtherIncome from '../steps/OtherIncome';
import Deductions80C from '../steps/Deductions80C';
import OtherDeductions from '../steps/OtherDeductions';

interface StepRendererProps {
  stepId: string;
  formData: any;
  updateFormData: (stepId: string, data: any) => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({ stepId, formData, updateFormData }) => {
  const data = formData[stepId] || {};
  const handleUpdate = (newData: any) => updateFormData(stepId, newData);

  switch (stepId) {
    case 'personal':
      return <PersonalDetails data={data} updateData={handleUpdate} />;
    case 'salary':
      return <SalaryIncome data={data} updateData={handleUpdate} />;
    case 'other-income':
      return <OtherIncome data={data} updateData={handleUpdate} />;
    case '80c':
      return <Deductions80C data={data} updateData={handleUpdate} />;
    case 'other-deductions':
      return <OtherDeductions data={data} updateData={handleUpdate} />;
    default:
      return <div>Unknown step</div>;
  }
};

export default StepRenderer; 