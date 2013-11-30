module.exports = {
  dist: {
    src: [
      'assets/loader.js',
      'tmp/tests.amd.js',
      'tmp/<%= pkg.name %>/**/*.amd.js',
      'tmp/<%= pkg.name %>.amd.js'
    ],
    dest: 'tmp/tests.js'
  }
};
