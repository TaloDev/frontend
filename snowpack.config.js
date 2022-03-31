/* eslint-disable no-undef */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    ['@snowpack/plugin-dotenv', { expand: Boolean(process.env.ENV_EXPAND) }],
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-webpack'
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    { 'match': 'routes', 'src': '.*', 'dest': '/index.html' }
  ],
  packageOptions: {},
  devOptions: {},
  buildOptions: {
    sourcemap: Boolean(process.env.ENABLE_SOURCEMAPS) || false
  }
}
