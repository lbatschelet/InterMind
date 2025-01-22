const path = require('path');

module.exports = {
  preset: 'jest-expo',
  rootDir: path.resolve(__dirname, '../..'),
  setupFiles: [
    '<rootDir>/__tests__/config/setup.ts'
  ],
  moduleNameMapper: {
    '^~/src/(.*)$': '<rootDir>/src/$1',
    '^~/assets/(.*)$': '<rootDir>/assets/$1'
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-native/.*|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      configFile: path.resolve(__dirname, '../../babel.config.js')
    }]
  }
}; 