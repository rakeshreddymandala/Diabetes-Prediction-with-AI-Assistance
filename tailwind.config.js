/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        borderGlow: "borderGlow 2s linear infinite",
      },
      keyframes: {
        borderGlow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 255, 255, 0.3)" },
          "50%": { boxShadow: "0 0 15px rgba(255, 255, 255, 0.6)" },
          "100%": { boxShadow: "0 0 5px rgba(255, 255, 255, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};
