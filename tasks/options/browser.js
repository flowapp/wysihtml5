module.exports = {
  dist: {
    src: 'tmp/<%= pkg.name %>.browser1.js',
    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
  },

  distNoVersion: {
    src: 'tmp/<%= pkg.name %>.browser1.js',
    dest: 'dist/<%= pkg.name %>.js'
  },

  UAIntegrationTests: {
    name: "ua_integration_tests",
    namespace: "UAIntegrationTests",
    src: "tmp/ua_integration_tests.browser1.js",
    dest: "dist/ua_integration_tests.js"
  }
};
