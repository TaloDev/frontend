/* eslint-disable no-undef */
module.exports = {
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/*/api/*/', '/*/constants/*/'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es)'
  ]
}
