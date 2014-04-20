module.exports = {
  tests: {
    options: {
      reporter: "spec",
      timeout: 30e3,
      usePromises: true,
      coffeeScript: true,
      browsers: [
        {browserName: "firefox"}
      ]
    },
    src: [
      'test/integration_tests/**/*.test.coffee',
      'test/integration_tests/**/*.test.js'
    ],
  }
};
