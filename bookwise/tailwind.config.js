/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#ffffff',
      darkBlue: '#004AAD',
      lightBlue: '#2C8ED6',
      buttonBg: '#FFF9D0',
      buttonHover: '#FFEBA1',
      primaryBlue: '#5AB2FF',
      backgroundBlue: '#CAF4FF'
    },
    fontFamily: {
      Debate: 'Audiowide'
    },
    extend: {
      backdropBlur: {
        lg: '10px'
      },
      backgroundColor: {
        'white-opacity': 'rgba(255, 255, 255, 0.3)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
}
