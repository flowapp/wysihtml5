module.exports = {
  tests: {
    options: {
      reporter: "spec",
      timeout: 30e3,
      usePromises: true
    },
    src: ['test/integration_tests/**/*.test.js'],
  }
};
