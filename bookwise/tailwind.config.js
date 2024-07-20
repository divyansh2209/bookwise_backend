/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'white': '#ffffff',
      'darkBlue': '#004AAD',
      'lightBlue': '#2C8ED6',
      'buttonBg': '#FFF9D0',
      'buttonHover': '#FFEBA1',
      'primaryBlue': '#5AB2FF',
      'backgroundBlue': '#CAF4FF',
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
