module.exports = function(grunt) {
  grunt.initConfig({
    jasmine: {
      javascripts: {
        src: [
          'node_modules/jquery-browser/lib/jquery.js',
          'javascripts/**/*.js'
        ],
        options: {
          specs: 'spec/unit/*Spec.js',
          helpers: 'spec/unit/*Helper.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['test']);
};
