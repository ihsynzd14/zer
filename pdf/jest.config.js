module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
    "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$": "babel-jest"
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(scss)$": "identity-obj-proxy",
    "react-pdf/dist/esm/entry.webpack": "react-pdf",
    '^src/(.*)$': '<rootDir>/src/$1',
    '^data/(.*)$': '<rootDir>/src/data/$1',
    '^stores/(.*)$': '<rootDir>/src/data/stores/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1'
  },

  transformIgnorePatterns: ["/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"],
  reporters: ["default"],
  coverageDirectory: "coverage",
  collectCoverage: true,
  coverageReporters: ["json", "text", "lcov"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/*",
    "!**/utils/**/*",
    "!**/data/**/*",
    "!**/stores/**/*",
    "!**/services/**/*",
    "!**/models/*",
    "!**/setupTests.e2e.js",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/setupTest.ts",
    "!**/bootstrap.tsx",
    "!**/index.ts"
  ],
  setupFilesAfterEnv: ["./src/setupTest.ts"]
};

