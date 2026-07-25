import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        status: {
          traced: '#10b981',
          partial: '#f59e0b',
          manual: '#6b7280',
          warning: '#ef4444',
          reviewed: '#8b5cf6',
        },
        internal: {
          bg: '#fef3c7',
          border: '#f59e0b',
        },
        client: {
          bg: '#ffffff',
          border: '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
};

export default config;
