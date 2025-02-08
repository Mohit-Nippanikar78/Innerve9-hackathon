import { Link, useLocation } from 'react-router-dom';
import { BarChart2, BookOpen, TrendingUp, User, LayoutDashboard, Database, MessageSquare, HelpCircle, Calculator, Bot } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useTour } from '../context/TourContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();
  const { openTour } = useTour();

  const menuItems = [
    { path: '/portfolio', icon: LayoutDashboard, label: 'Portfolio', tourClass: 'tour-portfolio' },
    { path: '/portfolio/chatbot', icon: Bot, label: 'Chatbot', tourClass: 'tour-chatbot' },
    { path: '/portfolio/my-data', icon: Database, label: 'My Data', tourClass: 'tour-my-data' },
    { path: '/portfolio/tax-calculator', icon: Calculator, label: 'Tax Calculator', tourClass: 'tour-tax-calculator' },
    { path: '/portfolio/recommendations', icon: TrendingUp, label: 'Recommendations', tourClass: 'tour-recommendations' },
    { path: '/portfolio/learn', icon: BookOpen, label: 'Money Matters', tourClass: 'tour-learn' },
    { path: '/portfolio/ai-assistant', icon: MessageSquare, label: 'AI Assistant', tourClass: 'tour-ai-assistant' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Link to="/" className="flex items-center tour-logo">
            <BarChart2 className="h-8 w-8 text-primary dark:text-primary" />
            <span className="ml-2 text-xl font-bold">
              <span className="text-black">WealthWise</span>
            </span>
          </Link>
        </div>


        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? `bg-primary text-white shadow-lg` 
                        : `text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary`
                    } ${item.tourClass}`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${
                      isActive ? 'text-white' : 'text-primary'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            to="/portfolio/profile"
            className="flex items-center space-x-3 hover:bg-primary/10 transition-colors p-2 rounded-lg group tour-profile"
          >
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary">
                {user?.fullName || 'User Name'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.primaryEmailAddress?.emailAddress || 'email@example.com'}
              </p>
            </div>
          </Link>

          {/* Tutorial Button */}
          <button
            onClick={openTour}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg transition-all duration-200"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Take a Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 