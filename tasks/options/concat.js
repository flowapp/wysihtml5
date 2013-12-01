module.exports = {
  amd: {
    src: [
      "vendor/**/*.js",
      "tmp/<%= pkg.name %>/**/*.amd.js",
      "tmp/<%= pkg.name %>.amd.js"
    ],
    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.amd.js'
  },

  amdNoVersion: {
    src: ['tmp/<%= pkg.name %>/**/*.amd.js', 'tmp/<%= pkg.name %>.amd.js'],
    dest: 'dist/<%= pkg.name %>.amd.js'
  },

  browser: {
    src: [
      "vendor/**/*.js",
      "tmp/<%= pkg.name %>/**/*.amd.js",
      "tmp/<%= pkg.name %>.amd.js"
    ],
    dest: 'tmp/<%= pkg.name %>.browser1.js'
  },

  commonjs: {
    src: [
      "vendor/**/*.js",
      "tmp/<%= pkg.name %>/**/*.cjs.js",
      "tmp/<%= pkg.name %>.cjs.js"
    ],
    dest: 'tmp/<%= pkg.name %>.browser1.js'
  }, 

  UAIntegrationTests: {
    src: [
      "vendor/loader.js",
      "tmp/ua_integration_tests/**/*.amd.js"
    ], 
    dest: "tmp/ua_integration_tests.browser1.js"
  }
};
