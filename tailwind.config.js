/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary',
    'bg-secondary',
    'text-secondary',
    'border-secondary',
  ],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Used for consistent coloring throughout the app
        brand: {
          primary: '#4F46E5', // indigo-600
          secondary: '#3B82F6', // blue-500
          accent: '#10B981', // emerald-500
          light: '#EEF2FF', // indigo-50
          dark: '#1F2937', // gray-800
        },
        school: {
          navy: '#003087', // IB Blue
          red: '#E71D36', // IB Red
          gold: '#F9A825', // Complementary accent
          green: '#34A853', // Success color
        },
        // Additional enhanced color palette
        midnight: {
          50: '#f0f4fc',
          100: '#d9e2f5',
          200: '#b3c5eb',
          300: '#89a3df',
          400: '#6a87d3',
          500: '#4a6cc8',
          600: '#3955a2',
          700: '#2d4683',
          800: '#1e3265',
          900: '#0f1932',
        },
      },
      boxShadow: {
        'rich': '0 10px 25px -5px rgba(0, 48, 135, 0.1), 0 8px 10px -6px rgba(0, 48, 135, 0.05)',
        'hover': '0 20px 35px -10px rgba(0, 48, 135, 0.2), 0 10px 20px -10px rgba(0, 48, 135, 0.1)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 3s infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};