module.exports = {
  tests: {
    options: {
      timeout: 30e3,
      usePromises: true,
      coffeeScript: true,
      mocha: {
        reporter: "spec"
      },
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
