module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  testTimeout: 10000
};
