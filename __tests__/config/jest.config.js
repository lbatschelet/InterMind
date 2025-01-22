module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@react-native/.*)'
  ],
  setupFiles: [
    '<rootDir>/jest.setup.ts'
  ],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^~/src/(.*)$': '<rootDir>/../../src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/../mocks/fileMock.js'
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/../mocks/'
  ],
  roots: ['<rootDir>/../..'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './config/babel.config.js' }]
  }
}; 