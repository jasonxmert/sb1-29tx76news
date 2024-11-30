/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8accff',
          400: '#4eb1ff',
          500: '#2490ff',
          600: '#0b6fff',
          700: '#0055eb',
          800: '#0647be',
          900: '#0c3d94',
        },
        secondary: {
          50: '#f4f7fb',
          100: '#e9eff7',
          200: '#cedeed',
          300: '#a3c4dd',
          400: '#72a3ca',
          500: '#4f85b5',
          600: '#3b6a98',
          700: '#31557b',
          800: '#2c4866',
          900: '#293e57',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#ffc9ab',
          300: '#ffa375',
          400: '#ff7440',
          500: '#ff4d1c',
          600: '#ed3009',
          700: '#c42208',
          800: '#9c1d0e',
          900: '#7e1b0f',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};