/* eslint-disable no-undef */
module.exports = {
  ...require('@snowpack/app-scripts-react/jest.config.js')(),
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/*/_snowpack/*/', '/*/api/*/', '/*/constants/*/'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es)'
  ]
}
