module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      sass: ["spec/stylesheets/test-out.css"]
    },
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('test', ['sass', 'clean', 'jasmine']);
  grunt.registerTask('default', ['test']);
};
