import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Volume2, VolumeX, Mic, MicOff, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Message {
  type: 'user' | 'bot';
  content: string | string[];
  timestamp: Date;
  isThinking?: boolean;
  isTyping?: boolean;
}

interface ITRState {
  currentStep: 'welcome' | 'income' | 'deductions' | 'summary';
  incomeDetails: {
    salary?: number;
    interest?: number;
    capitalGains?: number;
    rentalIncome?: number;
    otherIncome?: number;
    totalSalary?: number;
  };
  deductions: {
    section80C: {
      lic?: number;
      ppf?: number;
      elss?: number;
      nps?: number;
      others?: number;
    };
    section80D: {
      healthInsurance?: number;
      parentHealthInsurance?: number;
    };
    otherDeductions: {
      [key: string]: number;
    };
  };
  itrFormType?: string;
  taxCalculation?: {
    oldRegime?: number;
    newRegime?: number;
  };
}

interface SalaryDetails {
  basic: number;
  hra: number;
  special: number;
  other: number;
  bonus: number;
}

const thinkingPhrases = [
  "Processing your request...",
  "Analyzing the information...",
  "Computing results...",
  "Preparing response...",
  "Gathering insights...",
  "Evaluating options...",
  "Checking details...",
  "Almost ready..."
];

const defaultPrompts = [
  "Help me with financial planning",
  "What are the best investment options?",
  "How can I save tax?"
];

const welcomeMessage = `
Hello! 👋 I'm your AI Assistant. I'm here to help you with:

💰 Financial Planning
📈 Investment Advice
📊 Tax Planning
💡 Money-Saving Tips

How can I assist you today?`;

const AIAssistant = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: welcomeMessage,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentThinkingIndex, setCurrentThinkingIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [transcript, setTranscript] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string, messageIndex: number) => {
    window.speechSynthesis.cancel();

    if (isSpeaking === messageIndex) {
      setIsSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(null);
    };

    setIsSpeaking(messageIndex);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    handleSubmit(new Event('submit') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Add thinking message
    setMessages(prev => [...prev, {
      type: 'bot',
      content: ['🤔 Processing your request...'],
      timestamp: new Date(),
      isThinking: true
    }]);

    try {
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.isThinking) {
            return [
              ...prev.slice(0, -1),
              {
                type: 'bot',
                content: "I understand you're interested in financial assistance. I'm here to help! What specific aspect would you like to explore?",
                timestamp: new Date()
              }
            ];
          }
          return prev;
        });
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.isThinking) {
          return [
            ...prev.slice(0, -1),
            {
              type: 'bot',
              content: "I apologize, but I encountered an error. Please try again or rephrase your question.",
              timestamp: new Date()
            }
          ];
        }
        return prev;
      });
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      return recognition;
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                      AI Assistant
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your Personal Finance Guide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2.5 rounded-xl ${message.type === 'user' ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {message.type === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-primary dark:text-primary" />
                  )}
                </div>
                <div className={`relative p-5 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.type === 'bot' && !message.isThinking && (
                      <button
                        onClick={() => speak(
                          Array.isArray(message.content) 
                            ? message.content.join('\n') 
                            : message.content,
                          index
                        )}
                        className={`ml-2 p-1.5 rounded-full transition-colors ${
                          isSpeaking === index
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {isSpeaking === index ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="mb-5 flex flex-wrap gap-2">
            {defaultPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setIsSpeechModalOpen(true)}
              className="p-3 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary focus:outline-none"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Speech Modal */}
      {isSpeechModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setIsSpeechModalOpen(false);
                setIsListening(false);
                setTranscript('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Voice Input
              </h3>
              <div className="mb-8">
                <button
                  onClick={() => {
                    if (isListening) {
                      setIsListening(false);
                    } else {
                      startListening();
                    }
                  }}
                  className={`p-6 rounded-full ${
                    isListening
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                  } hover:opacity-80 transition-opacity`}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </button>
              </div>
              <div className="min-h-[120px] p-5 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 text-sm mb-6">
                {transcript || 'Start speaking...'}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setInput(transcript);
                    setIsSpeechModalOpen(false);
                    setIsListening(false);
                    setTranscript('');
                  }}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Use Text
                </button>
                <button
                  onClick={() => {
                    setTranscript('');
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 