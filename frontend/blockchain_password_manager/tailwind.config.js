/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // upewnij się, że Tailwind widzi twoje pliki
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14F195",  // zielony
        secondary: "#00FFA3", // seledynowy
        accent: "#9945FF",    // fioletowy
        dark: "#060010"       // tło
      },
    },
  },
  plugins: [],
};