module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };
  