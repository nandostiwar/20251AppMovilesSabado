/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000', // Black
        secondary: '#4B5563', // Gray
        accent: '#FFFFFF', // White
      },
    },
  },
  plugins: [],
}

