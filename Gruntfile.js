module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var config = require('load-grunt-config')(grunt, {
    configPath: process.cwd() +"/tasks/options",
    init: false
  });

  grunt.loadTasks('tasks');

  this.registerTask('default', ['build']);

  // Run client-side tests on the command line.
  this.registerTask('test', 'Runs tests through the command line using PhantomJS', [
    'build', 'tests' //, 'connect'
  ]);

  // Build test files
  this.registerTask('tests', 'Builds the test package', [
    // 'concat:deps', 
    // 'browserify:tests',
    // 'transpile:testsAmd', 
    // 'transpile:testsCommonjs', 
    'buildTests:dist'
  ]);

  // UAIntegrationTests
  this.registerTask("integration", "Build integration tests", [
    "clean", 
    "transpile:UAIntegrationTests", 
    "concat:UAIntegrationTests", 
    "browser:UAIntegrationTests",
    "mocha_phantomjs:UAIntegrationTests"
  ]);

  // Build a new version of the library
  this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>',
                    ['clean', 'transpile:amd', 'concat:browser', 'browser:distNoVersion', "uglify:browserNoVersion"]);


  this.registerTask('build-cjs', 'Builds a distributable version of <%= cfg.name %>',
                    ['clean', 'transpile:commonjs', 'concat:commonjs', 'browser:distNoVersion']);


  // Custom phantomjs test task
  this.registerTask('test:phantom', "Runs tests through the command line using PhantomJS", [
                    'build', 'tests', 'mocha_phantomjs']);

  this.registerTask('test', ['build', 'tests', 'mocha_phantomjs']);

  config.env = process.env;
  config.pkg = grunt.file.readJSON('package.json');

  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.initConfig(config);
};