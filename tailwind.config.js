export default {
  content: [
    './public/**/*.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      minWidth: {
        '10': '2.5rem',
        '20': '5rem',
        '40': '10rem',
        '60': '15rem',
        '80': '20rem'
      }
    }
  }
}
