// eslint-disable-next-line no-undef
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    ['@snowpack/plugin-dotenv', { expand: Boolean(Number(process.env.EXPAND_ENV)) }],
    '@snowpack/plugin-postcss',
    '@jadex/snowpack-plugin-tailwindcss-jit',
    '@snowpack/plugin-webpack'
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    {'match': 'routes', 'src': '.*', 'dest': '/index.html'}
  ],
  packageOptions: {},
  devOptions: {
    // tailwindConfig: './tailwind.config.js'
  }
}
