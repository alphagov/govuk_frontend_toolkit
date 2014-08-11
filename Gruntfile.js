module.exports = function(grunt) {

  var allSASSFiles = [];

  grunt.file.recurse(
    "./stylesheets/",
    function(absolutePath, rootDirectory, subdirectory, filename) {

      if (filename.match(/\.scss$/)) allSASSFiles.push("@import '../../" + absolutePath + "';");

    }
  );

  grunt.file.write(
    "spec/stylesheets/test.scss", allSASSFiles.join("\n")
  );

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
    },
    sass: {
      development: {
        files: {
          'spec/stylesheets/test-out.css': 'spec/stylesheets/test.scss'
        },
        options: {
          loadPath: [
            'stylesheets'
          ],
          style: 'nested',
        }
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('test', ['sass', 'jasmine']);
  grunt.registerTask('default', ['test']);
};
