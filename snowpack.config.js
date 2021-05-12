module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss',
    // '@jadex/snowpack-plugin-tailwindcss-jit',
    // '@snowpack/plugin-webpack',
    '@efox/snowpack-plugin-webpack5'
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    {"match": "routes", "src": ".*", "dest": "/index.html"}
  ],
  // optimize: {
  //   bundle: true,
  //   minify: true,
  //   target: 'es2020'
  // },
  packageOptions: {},
  devOptions: {}
}
