import { Link } from 'react-router-dom';
import { FileText, Calculator, Brain, MessageSquare, Phone } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: 'Interactive Chat Interface',
    description: 'User-friendly conversational interface with text and voice input support for seamless ITR filing guidance.'
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: 'Smart Form Selection',
    description: 'Intelligent recommendation of appropriate ITR forms based on your income sources and financial profile.'
  },
  {
    icon: <Calculator className="h-6 w-6 text-white" />,
    title: 'Tax Calculation & Savings',
    description: 'Accurate tax liability calculation and personalized tax-saving investment recommendations.'
  },
  {
    icon: <Brain className="h-6 w-6 text-white" />,
    title: 'AI-Powered Assistance',
    description: 'Advanced AI technology to provide accurate, up-to-date tax filing guidance and investment advice.'
  }
];

const Home = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleCallRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    setRequestStatus('loading');
    try {
      // Simulate API call - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequestStatus('success');
      setPhoneNumber('');
      setTimeout(() => setRequestStatus('idle'), 3000);
    } catch (error) {
      setRequestStatus('error');
      setTimeout(() => setRequestStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block text-primary">Smart ITR Filing</span>
                  <span className="block">Made <span className="text-primary">Simple!</span></span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Navigate your Income Tax Return filing journey with our AI-powered chatbot. Get personalized guidance, form recommendations, and tax-saving tips through a simple conversation.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/sign-up" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10 transition-all duration-300">
                      Start Filing ITR
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/portfolio/chatbot" className="w-full flex items-center justify-center px-8 py-3 border-2 border-primary text-base font-medium rounded-md text-primary hover:bg-primary hover:text-white md:py-4 md:text-lg md:px-10 transition-all duration-300">
                      Try Chatbot
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
            alt="ITR Filing Assistant"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simplify Your <span className="text-primary">Tax Filing</span> Journey
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Our smart chatbot guides you through every step of the ITR filing process with ease and accuracy.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-white rounded-xl px-6 pb-8 hover:shadow-xl transition-all duration-300">
                    <div className="-mt-6">
                      <div className={`inline-flex items-center justify-center p-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 ${index % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}>
                        {feature.icon}
                      </div>
                      <h3 className="mt-8 text-lg font-semibold text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request a Call Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-primary rounded-3xl shadow-xl overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
            </div>
            <div className="relative px-8 py-12 sm:px-12 sm:py-16 lg:py-20">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Need Personal Tax Guidance?</span>
                  <span className="block text-white/90 mt-2">Request a Call Back</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-white/80">
                  Enter your phone number below and our tax experts will call you back within 24 hours to provide personalized ITR filing guidance.
                </p>
                <form onSubmit={handleCallRequest} className="mt-8 sm:flex justify-center">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your 10-digit phone number"
                      className="block w-full px-5 py-3 text-base text-gray-900 placeholder-gray-500 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                      required
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      disabled={requestStatus === 'loading'}
                      className={`block w-full px-5 py-3 text-base font-medium text-primary bg-white border border-transparent rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary sm:px-10 ${
                        requestStatus === 'loading' ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {requestStatus === 'loading' ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : requestStatus === 'success' ? (
                        <span className="flex items-center justify-center text-green-600">
                          <Phone className="h-5 w-5 mr-2" />
                          Request Sent!
                        </span>
                      ) : requestStatus === 'error' ? (
                        'Error. Try Again'
                      ) : (
                        'Request Call'
                      )}
                    </button>
                  </div>
                </form>
                <p className="mt-4 text-sm text-white/70">
                  By submitting this form, you agree to receive a callback from our tax experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Meet Our <span className="text-secondary">Team</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The brilliant minds behind WealthWise's AI-powered financial solutions.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Rachit Chheda',
                role: 'Full Stack Developer',
                image: 'https://rachit-chheda.netlify.app/static/media/HeroImage.ff8c45127080e96bd251.jpg',
                description: 'Specializes in AI/ML and financial algorithms. Led the development of our core investment analysis engine.',
                highlight: 'Web Dev Expert',
                github: 'https://github.com/rachitgupta',
                linkedin: 'https://linkedin.com/in/rachitgupta'
              },
              {
                name: 'Mohit Nippanikar',
                role: 'Full Stack Developer',
                image: 'https://media.licdn.com/dms/image/v2/D4D03AQG66DosJBznsg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729079824237?e=1743033600&v=beta&t=wWWlB1pGo9Vcw9n30RbsocpZfubu1oHtPGURV6V3cVE',
                description: 'UI/UX specialist with expertise in creating intuitive and responsive financial dashboards.',
                highlight: 'UI/UX Specialist',
                github: 'https://github.com/johnsmith',
                linkedin: 'https://linkedin.com/in/johnsmith'
              },
              {
                name: 'Meet Patel',
                role: 'AI/ML Developer',
                image: 'https://media.licdn.com/dms/image/v2/D5603AQF3PUbfQY3j3A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709204577716?e=1743033600&v=beta&t=7hCvxbS2_dtipC9F2xtwJpBhWLw5xvrx7MVUxE0YX9w',
                description: 'Security and scalability expert. Architected our robust financial data processing pipeline.',
                highlight: 'AI/ML Expert',
                github: 'https://github.com/emmawilson',
                linkedin: 'https://linkedin.com/in/emmawilson'
              }
            ].map((member, index) => (
              <div key={member.name} className="bg-white overflow-hidden shadow-lg rounded-xl flex flex-col hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Image Container with fixed aspect ratio and highlight effect */}
                <div className="relative pt-[100%]">
                  <div className="absolute inset-0 p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-xl group">
                      <img
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={member.image}
                        alt={member.name}
                      />
                      {/* Highlight overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary/10" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <p className="text-sm font-medium text-primary">
                        {member.role}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {member.highlight}
                    </span>
                  </div>
                  <p className="text-base text-gray-600 flex-1">
                    {member.description}
                  </p>
                  
                  {/* Social Links - Fixed at bottom */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center space-x-6">
                    <a 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="sr-only">GitHub</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
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

export default Home;