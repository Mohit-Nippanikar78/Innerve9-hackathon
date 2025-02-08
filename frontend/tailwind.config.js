/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#04ad83",
        secondary: "#5065f6",
        accent: "#04f1bc",
        background: "#ffffff",
        textPrimary: "#333333",
        textSecondary: "#666666"
      }
    },
  },
  plugins: [],
};