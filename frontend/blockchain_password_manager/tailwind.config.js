// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0b0014",
        light: "#170d27",
        primary: "#b86bffff",
        secondary: "#6366f1",
        accent: "#ec4899",
      },
      boxShadow: {
        glow: "0 0 20px rgba(168,85,247,0.6)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};