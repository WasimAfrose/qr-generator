import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // enable class based dark mode
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add some fresh pastel colors if you want
        // but the background gradient in the component is enough
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass:
          "0 4px 30px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 255, 255, 0.15)",
      },
      borderRadius: {
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
