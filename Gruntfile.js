module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  var config = require("load-grunt-config")(grunt, {
    configPath: process.cwd() +"/tasks/options",
    init: false
  });
  config.env = process.env;
  config.pkg = grunt.file.readJSON("package.json");

  grunt.loadTasks("tasks");

  this.registerTask("default", ["build"]);

  // Build a new version of the library
  this.registerTask("build", "Builds a distributable version of “"+ config.pkg.name +"”", [
    "clean",
    "transpile:amd",
    "concat:browser",
    "browser:distNoVersion",
    "uglify:browserNoVersion"
  ]);

  this.registerTask("test", [
    "build",
    "connect",
    "mochaSelenium:tests"
  ]);

  grunt.initConfig(config);
};
