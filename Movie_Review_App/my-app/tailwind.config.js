/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream: '#FAF8F4',
        ink: {
          DEFAULT: '#1A1A1A',
          light: '#555555',
          muted: '#999999',
        },
        accent: {
          DEFAULT: '#C8102E',
          light: '#F5E6E9',
        },
        gold: '#D4A843',
        border: '#E8E4DD',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(0,0,0,0.06)',
        md: '0 4px 20px rgba(0,0,0,0.08)',
        lg: '0 12px 48px rgba(0,0,0,0.12)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease forwards',
      },
    },
  },
  plugins: [],
};