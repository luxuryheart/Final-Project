/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: "#F1F6F9",
        colorBlueDark: "#394867",
        colorDark: "#212A3E",
        colorBlueGray: "#9BA4B5",
        bgForm: "#FDFDFD",
        textTitle: "#797F8B"
      }
    },
  },
  plugins: [require("daisyui")],
}

