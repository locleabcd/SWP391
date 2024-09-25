/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['Forte', 'cMyriad Variable Concept']
      },
      colors: {
        'custom-dark': '#24303F',
        'custom-Beige': '#EBDDCB',
        'custom-light': '#1A222C'
      },
      animation: {
        'slow-spin': 'spin 4s linear infinite'
      }
    }
  },
  // eslint-disable-next-line no-undef
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scroll-bar': {
          /* Ẩn thanh cuộn nhưng vẫn có thể cuộn */
          'scrollbar-width': 'none' /* Firefox */,
          '-ms-overflow-style': 'none' /* IE and Edge */
        },
        '.no-scroll-bar::-webkit-scrollbar': {
          display: 'none' /* Safari and Chrome */
        }
      })
    }
  ]
}
