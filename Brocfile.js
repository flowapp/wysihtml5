module.exports = function (broccoli) {
  var staticCompiler = require('broccoli-static-compiler');
  var mergeTrees = require('broccoli-merge-trees');
  var compileES6 = require('broccoli-es6-concatenator');
  var replace = require('broccoli-replace');
  var concat = require('broccoli-concat');
  var exporter = require('broccoli-global-export');

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

  application = compileES6(application, {
    loaderFile: 'vendor/loader.js',
    ignoredModules: [],
    inputFiles: [
      'vendor/**/*.js',
      '**/*.js'
    ],
    legacyFilesToAppend: [
      'vendor/base.js',
      'vendor/rangy.js',
    ],
    wrapInEval: false,
    outputFile: '/wysihtml5.cjs.js'
  });

  var exportTree = new mergeTrees([application, "src"], {overwrite: true});
  exportTree = new exporter(exportTree, {
    name: packageJSON.name,
    namespace: packageJSON.namespace,
    inputFiles: ["wysihtml5.cjs.js"],
    outputFile: "/wysihtml5.js"
  });

  return new mergeTrees([exportTree, application], {overwrite: true});
};
