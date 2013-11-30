function nameFor(path) {
  var result,  match;
  if (match = path.match(/^(?:lib|test|test\/tests)\/(.*?)(?:\.js)?$/)) {
    result = match[1];
  } else {
    result = path;
  }

  return path;
}

module.exports = {
  amd: {
    moduleName: nameFor,
    type: 'amd',
    files: [{
      expand: true,
      cwd: 'src/',
      src: ['**/*.js'],
      dest: 'tmp/wysihtml5/',
      ext: '.amd.js'
    }]
  },

  commonjs: {
    moduleName: nameFor,
    type: 'cjs',
    files: [{
      expand: true,
      cwd: 'src/',
      src: ['**/*.js'],
      dest: 'tmp/wysihtml5/',
      ext: '.cjs.js'
    }, {
      src: ['src/<%= pkg.name %>.js'],
      dest: 'dist/commonjs/main.js'
    }]
  },

  testsAmd: {
    moduleName: nameFor,
    type: 'amd',
    src: ['test/test_helpers.js', 'test/tests.js', 'test/tests/**/*_test.js'],
    dest: 'tmp/tests.amd.js'
  },

  testsCommonjs: {
    moduleName: nameFor,
    type: 'cjs',
    src: ['test/test_helpers.js', 'test/tests.js', 'test/tests/**/*_test.js'],
    dest: 'tmp/tests.cjs.js'
  }
};
