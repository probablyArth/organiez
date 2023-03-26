/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        DM: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
