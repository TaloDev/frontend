module.exports = {
  purge: [
    './src/**/*.jsx',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      '40': '10rem',
      '60': '15rem',
      '80': '20rem'
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      cursor: ['disabled'],
      opacity: ['disabled'],
      textColor: ['active']
    }
  },
  plugins: []
}
