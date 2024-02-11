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
        textTitle: "#797F8B",
        bgRed: "#DD1313",
        room: "#E5F2FA",
        bgModal: "#FBFBFB",
        bgBlueInput: "#C9D3E8",
        bgLine: "#8DA0C8",
        bgCyan: "#5B77AF"
      }
    },
  },
  plugins: [require("daisyui")],
}

