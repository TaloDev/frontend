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
      opacity: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      cursor: ['disabled']
    }
  },
  plugins: []
}
