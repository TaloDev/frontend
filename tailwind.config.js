module.exports = {
  purge: [
    './src/**/*.jsx',
    './public/index.html'
  ],
  darkMode: false,
  theme: {
    minWidth: {
      '5': '1.25rem',
      '10': '2.5rem',
      '20': '5rem',
      '30': '7.5rem',
      '40': '10rem',
      '50': '12.5rem',
      '60': '15rem',
      '70': '17.5rem',
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
