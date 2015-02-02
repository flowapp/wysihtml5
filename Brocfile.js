module.exports = function (broccoli) {
  var staticCompiler = require('broccoli-static-compiler');
  var mergeTrees = require('broccoli-merge-trees');
  var replace = require('broccoli-replace');
  var compileModules = require('broccoli-es6-module-transpiler');

  var packageJSON = require('./package.json');

  var vendorTree = staticCompiler('vendor', {
    srcDir: '/',
    destDir: 'vendor'
  });

  var application = new mergeTrees([vendorTree, 'src'], {overwrite: true})

  application = replace(application, {
    files: [
      '**/*.js'
    ],
    patterns: [
      {
        match: 'version',
        replacement: packageJSON.version
      },
      {
        match: 'repo',
        replacement: packageJSON.repository.url
      }
    ]
  });

  application = compileModules(application, {
    format: 'bundle',
    entry: 'wysihtml5.js',
    output: 'wysihtml5.js'
  });

  return application;
};
