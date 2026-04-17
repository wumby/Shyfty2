/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        panel: '#1E293B',
        border: '#334155',
        accent: '#3B82F6',
        ink: '#F1F5F9',
        muted: '#94A3B8',
      },
    },
  },
  plugins: [],
};
