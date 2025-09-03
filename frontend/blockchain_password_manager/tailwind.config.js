// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0b0014", // ciemne tło
        light: "#170d27", // jasne tło
        primary: "#a855f7", // fiolet (violet-500 vibe)
        secondary: "#6366f1", // niebieski (indigo-500 vibe)
        accent: "#ec4899", // róż (pink-500 vibe)
      },
      boxShadow: {
        glow: "0 0 20px rgba(168,85,247,0.6)",
      },
    },
  },
  plugins: [],
};