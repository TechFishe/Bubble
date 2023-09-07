/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        fullScreen: "calc(100vh - 108px)"
      },
      divideWidth: {
        1: "1px"
      },
      borderWidth: {
        1: "1px"
      }
    },
  },
  plugins: [],
}

