// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeInBackground: {
          "0%": { opacity: "0", transform: "scale(1.1)" }, // Image starts slightly larger for zoom effect
          "100%": { opacity: "1", transform: "scale(1)" }, // Ends fully visible and scaled normally
        },
        fadeInLeftBox: {
          "0%": { opacity: "0", transform: "translateX(-50px)" }, // Starts off-screen to the left
          "100%": { opacity: "1", transform: "translateX(0)" }, // Ends in the original position
        },
      },
      animation: {
        "fade-in-bg": "fadeInBackground 2s ease-out forwards",
        "fade-in-left-box": "fadeInLeftBox 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
