/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#d9e2f5',
          200: '#b3c6eb',
          300: '#8ca9e0',
          400: '#668dd6',
          500: '#4070cc',
          600: '#335aa3',
          700: '#26447a',
          800: '#192e52',
          900: '#0d1726',
          950: '#06111a',
        },
      }
    },
  },
  plugins: [],
};