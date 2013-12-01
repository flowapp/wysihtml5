module.exports = function(grunt) {
  grunt.registerMultiTask('browser', 'Export the object in <%= pkg.name %> to the window', function() {
    this.files.forEach(function(f) {
      var output = ['(function(globals) {'];
      name = f.name || "<%= pkg.name %>"; 
      namespace = f.namespace || "<%= pkg.namespace %>";

      output.push.apply(output, f.src.map(grunt.file.read));

      output.push("window."+ namespace +" = requireModule('"+ name +"');");
      output.push('}(window));');

      grunt.file.write(f.dest, grunt.template.process(output.join('\n')));
    });
  });
};
