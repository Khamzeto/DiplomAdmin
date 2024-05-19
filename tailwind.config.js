/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        customWhite: '#fff',
        gray: 'rgb(26, 32, 38)',
        primary: '#237AAB',
        ccc: '#CCC',
        blueText: '#2A85FF',
        grayText: '#939598',
        redText: '#F6522E',
        borderGray: 'rgb(204, 204, 204)',
        lightBlack: 'rgba(0, 0, 0, 0.5)',
        bgGray: '#F2F4F6',
        grayBg: '#F2F4F6',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
