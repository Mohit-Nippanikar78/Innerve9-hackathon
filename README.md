# Smart ITR Filing Assistant

## Demo Video
https://github.com/user-attachments/assets/17e86b99-5ba4-4f27-a622-6502a4007498

## Overview
A comprehensive Income Tax Return (ITR) filing assistant powered by AI, designed to simplify the tax filing process and provide personalized financial guidance.

## Key Features

### 1. Smart ITR Filing Chatbot
- Interactive conversational interface with text and voice input
- Step-by-step guidance through ITR filing process
- Real-time tax form recommendations
- Personalized assistance based on income sources
- Voice commands and text-to-speech support

### 2. AI Financial Assistant
- Personalized financial planning advice
- Investment recommendations
- Tax-saving suggestions
- Money management tips
- Voice-enabled interactions

### 3. Tax Calculator
- Comprehensive tax liability calculation
- Support for both old and new tax regimes
- Detailed breakdown of tax components
- Real-time calculation updates
- Tax saving recommendations

### 4. User Dashboard
- Portfolio overview and management
- Income tracking and analysis
- Personal data management
- Investment recommendations
- Educational resources

### 5. Data Management
- Secure storage of financial information
- Income source tracking
- Deduction management
- Document upload and storage
- Data export capabilities

### 6. Educational Resources
- Money Matters learning section
- Investment education
- Tax-saving guides
- Financial planning tutorials
- Market insights

### 7. User Experience Features
- Dark/Light mode support
- Interactive guided tour
- Voice input/output capabilities
- Mobile-responsive design
- Real-time updates

### 8. Security & Privacy
- Secure user authentication (Clerk)
- Protected routes
- Encrypted data transmission
- Privacy-focused design
- Secure API integration

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context
- **UI Components**: Framer Motion, Lucide Icons
- **Authentication**: Clerk
- **API Integration**: Axios
- **Voice Features**: Web Speech API

## Project Structure
```
frontend/src/
├── components/
│   ├── AuthComponent
│   ├── DashboardLayout
│   ├── Navbar
│   ├── ProtectedRoute
│   └── Sidebar
├── pages/
│   ├── AIAssistant
│   ├── Chatbot
│   ├── Home
│   ├── Income
│   ├── Learn
│   ├── MyData
│   ├── Portfolio
│   ├── Profile
│   ├── Recommendations
│   └── TaxCalculator
├── context/
│   ├── ThemeContext
│   └── TourContext
└── utils/
    └── API configurations
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/smart-itr-assistant.git
```

2. Install dependencies
```bash
cd smart-itr-assistant
npm install
```

3. Set up environment variables
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

4. Run the development server
```bash
npm run dev
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
