module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'], 
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  reporters: [
    "default",
    ["jest-html-reporter", { outputPath: "test-report.html" }]
  ]
};