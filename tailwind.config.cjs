/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  daisyui: {
    themes: ['fantasy', 'dracula'],
    darkTheme: 'dracula'
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
};
