import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Plus, Trash2, Edit2, TrendingUp, Download, Filter } from 'lucide-react';

interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: 'Monthly' | 'Yearly' | 'One-time';
  category: string;
  date: string;
}

const Income = () => {
  const [incomes, setIncomes] = useState<Income[]>(() => {
    const savedIncomes = localStorage.getItem('userIncomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['Salary', 'Investment', 'Business', 'Freelance', 'Other'];

  const totalIncome = incomes.reduce((sum, income) => {
    const amount = income.frequency === 'Yearly' ? income.amount / 12 : income.amount;
    return sum + amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Income Manager</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage your income sources</p>
            </div>
            <button
              onClick={() => {
                setSelectedIncome(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Income
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Monthly Income</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(totalIncome)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Income Sources</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {incomes.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Update</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {incomes.length > 0 
                      ? new Date(Math.max(...incomes.map(i => new Date(i.date).getTime()))).toLocaleDateString()
                      : 'No entries'
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Income List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-48 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Income List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {incomes
              .filter(income => filterCategory === 'all' || income.category === filterCategory)
              .map((income) => (
                <div 
                  key={income.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        income.category === 'Salary' ? 'bg-primary/10' :
                        income.category === 'Investment' ? 'bg-secondary/10' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <IndianRupee className={`h-6 w-6 ${
                          income.category === 'Salary' ? 'text-primary' :
                          income.category === 'Investment' ? 'text-secondary' :
                          'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {income.source}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {income.category} • {income.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(income.amount)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedIncome(income);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            const newIncomes = incomes.filter(i => i.id !== income.id);
                            setIncomes(newIncomes);
                            localStorage.setItem('userIncomes', JSON.stringify(newIncomes));
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income; 