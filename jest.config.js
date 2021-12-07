module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  }
};
