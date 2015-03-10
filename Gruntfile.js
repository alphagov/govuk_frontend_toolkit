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
          'node_modules/jquery-browser/lib/jquery.js',
          'javascripts/govuk/analytics/google-analytics-classic-tracker.js',
          'javascripts/govuk/analytics/google-analytics-universal-tracker.js',
          'javascripts/govuk/analytics/tracker.js',
          'javascripts/**/*.js'
        ],
        options: {
          specs: 'spec/unit/**/*Spec.js',
          helpers: 'spec/unit/*Helper.js'
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
    scsslint: {
      allFiles: [
        'stylesheets/*.scss',
        'stylesheets/**/*.scss'
      ],
      options: {
        bundleExec: true,
        config: '.scss-lint.yaml'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-scss-lint');

  grunt.registerTask('test', ['sass', 'clean', 'jasmine', 'scsslint']);
  grunt.registerTask('default', ['test']);
};
