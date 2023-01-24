module.exports = {
  clearMocks: true,
  setupFiles: ['<rootDir>/jest/globalMocks.ts'],
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  rootDir: '../',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
