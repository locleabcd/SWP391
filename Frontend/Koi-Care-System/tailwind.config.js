/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['Forte', 'cMyriad Variable Concept'],
        poppins: ['Poppins', 'sans-serif'],
        averia: ['Averia Serif Libre', 'serif']
      },
      colors: {
        'custom-dark': '#24303F',
        'custom-Beige': '#EBDDCB',
        'custom-light': '#1A222C',
        'custom-layout-light': '#ECF2FF',
        'custom-layout-dark': '#253662',
        'custom-left-bar': '#5D87FF',
        'custom-border': 'rgb(51, 63, 85)'
      },
      animation: {
        'slow-spin': 'spin 4s linear infinite',
        'slow-spinn': 'spin 20s linear infinite'
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
