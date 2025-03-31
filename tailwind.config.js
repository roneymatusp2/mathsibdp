/** @type {import('tailwindcss').Config} */
export default {
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
        }
      },
    },
  },
  plugins: [],
};