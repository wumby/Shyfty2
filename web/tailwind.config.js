/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07111f',
        panel: '#0d1b2f',
        border: '#18304d',
        accent: '#49a6ff',
        ink: '#e8f0ff',
        muted: '#8aa3c1',
      },
      boxShadow: {
        bloom: '0 18px 60px rgba(12, 27, 46, 0.45)',
      },
    },
  },
  plugins: [],
};

