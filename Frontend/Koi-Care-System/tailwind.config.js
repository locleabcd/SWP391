/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['Forte', 'cMyriad Variable Concept']
      },
      colors: {
        'custom-dark': '#24303F'
      },
      animation: {
        'slow-spin': 'spin 4s linear infinite'
      }
    }
  },
  // eslint-disable-next-line no-undef
  plugins: [require('tailwind-scrollbar')]
}
