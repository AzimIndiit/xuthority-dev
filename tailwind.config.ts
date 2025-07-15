/** @type {import('tailwindcss').Config} */
const config = {
    theme: {
      extend: {
        colors: {
          red: {
            500: '#E91515',
            600: '#E91515',
          },
          blue: {
            500: '#0071E3',
            600: '#0071E3',
          },
        },
        animation: {
          'fadeIn': 'fadeIn 0.3s ease-in-out',
          'bounce': 'bounce 1s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
  }
  export default config