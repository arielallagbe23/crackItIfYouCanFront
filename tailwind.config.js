module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 40px #ff0000", // Effet rouge brillant
      },
      animation: {
        flicker: "flicker 1.5s infinite", // Animation pour simuler le scintillement
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};
