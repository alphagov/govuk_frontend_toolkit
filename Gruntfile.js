module.exports = function(grunt) {
  var allSassFiles = [];

  var path = require('path');

  grunt.file.recurse(
    "./stylesheets/",
    function(abspath, rootdir, subdir, filename) {
      if(typeof subdir !== 'undefined'){
        var relpath = subdir + '/' + filename;
      } else {
        var relpath = filename;
      }
      if (filename.match(/\.scss/)) {
        allSassFiles.push("@import '" + relpath + "';");
      }
    }
  );

  grunt.file.write(
    "./spec/stylesheets/test.scss",
    allSassFiles.join("\n")
  );

  grunt.initConfig({
    clean: {
      sass: ["spec/stylesheets/test*css"]
    },
    jasmine: {
      javascripts: {
        src: [
          'node_modules/jquery/dist/jquery.js',
          'javascripts/govuk/analytics/google-analytics-universal-tracker.js',
          'javascripts/govuk/analytics/analytics.js',
          'javascripts/**/*.js'
        ],
        options: {
          specs: 'spec/unit/**/*.spec.js',
          helpers: 'spec/unit/*.helper.js'
        }
      }
    },
    sass: {
      development: {
        files: {
          './spec/stylesheets/test-out.css': './spec/stylesheets/test.scss'
        },
        options: {
          loadPath: [
            './stylesheets'
          ],
          style: 'nested',
        }
      },
    },
    shell: {
      multiple: {
        command: [
          'bundle',
          'bundle exec govuk-lint-sass stylesheets'
        ].join('&&')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('test', ['sass', 'clean', 'jasmine', 'shell']);
  grunt.registerTask('default', ['test']);
};
