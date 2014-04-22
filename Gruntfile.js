module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  var config = require("load-grunt-config")(grunt, {
    configPath: process.cwd() +"/tasks/options",
    init: false
  });
  config.env = process.env;
  config.pkg = grunt.file.readJSON("package.json");

  grunt.loadTasks("tasks");

  this.registerTask("default", ["test"]);

  this.registerTask("test", [
    "connect",
    "mochaSelenium:tests"
  ]);

  grunt.initConfig(config);
};
