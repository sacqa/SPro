/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6C3FC5', dark: '#4A2A8C', light: '#8B5CF6' },
        accent: '#22C55E',
        brand: { bg: '#F5F5F5', card: '#FFFFFF', border: '#E5E7EB' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      borderRadius: { card: '12px', btn: '8px', pill: '50px' },
      boxShadow: { card: '0 2px 8px rgba(0,0,0,0.08)', nav: '0 -2px 8px rgba(0,0,0,0.08)' },
    },
  },
  plugins: [],
};
