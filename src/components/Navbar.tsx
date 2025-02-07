import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { BarChart2 } from 'lucide-react';

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BarChart2 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">Wealth<span className="text-primary">Wise</span></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <Link 
                to="/portfolio" 
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/sign-in" 
                  className="flex items-center justify-center px-4 py-2 border-2 border-secondary text-sm font-medium rounded-md text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;