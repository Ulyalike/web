export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  modulePathIgnorePatterns: [
    '<rootDir>/__tests__/helpers/',
  ],
  setupFiles: [
    'dotenv/config',
  ],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/plugin.js',
  ],
};
