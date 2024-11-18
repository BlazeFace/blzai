/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  daisyui: {
    themes: ['fantasy', 'dracula']
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
};
