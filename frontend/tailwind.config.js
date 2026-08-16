/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff4ed',
          100: '#ffedd5',
          500: '#f25c05',
          600: '#d94e00',
          700: '#c2410c',
        }
      }
    },
  },
  plugins: [],
}
