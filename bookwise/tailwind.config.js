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
      'lightBlue': '#004AAD',

    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}