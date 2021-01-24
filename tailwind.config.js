module.exports = {
  purge: [
    './src/**/*.jsx',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
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
