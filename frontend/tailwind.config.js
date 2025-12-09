/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefaf3',
          100: '#fdf3e0',
          200: '#f9e4b8',
          300: '#f4d08a',
          400: '#d9a545',
          500: '#c4912a',
          600: '#A87C1D',
          700: '#8a6518',
          800: '#6d5014',
          900: '#503b0f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
