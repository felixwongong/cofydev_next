/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["sunset", "retro"],
    darkTheme: "sunset"
  }
}
