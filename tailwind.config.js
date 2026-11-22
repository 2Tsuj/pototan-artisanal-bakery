/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        cream: "#FAF6F0",
        brioche: "#F3ECE1",
        parchment: "#FFFFFF",
        espresso: "#231812",
        cacao: "#6E5A4F",
        terracotta: "#C85A32",
        pandan: "#2D6A4F",
        ube: "#6C3B8C",
        butter: "#D97706",
        line: "#E6DDD0",
      },
    },
  },
  plugins: [],
};
