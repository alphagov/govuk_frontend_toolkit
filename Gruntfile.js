module.exports = function (grunt) {
  var allSassFiles = []

  grunt.file.recurse(
    './stylesheets/',
    function (abspath, rootdir, subdir, filename) {
      var relpath
      if (typeof subdir !== 'undefined') {
        relpath = subdir + '/' + filename
      } else {
        relpath = filename
      }
      if (filename.match(/\.scss/)) {
        allSassFiles.push("@import '" + relpath + "';")
      }
    }
  )

  allSassFiles.push("@import '_colour_contrast_spec.scss';")

  grunt.file.write(
    './spec/stylesheets/test.scss',
    allSassFiles.join('\n')
  )

  grunt.initConfig({
    clean: {
      sass: ['spec/stylesheets/test*css']
    },
    jasmine: {
      javascripts: {
        src: [
          'node_modules/jquery/dist/jquery.js',
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
            './node_modules',
            './stylesheets',
            './spec/stylesheets'
          ],
          style: 'nested'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  grunt.loadNpmTasks('grunt-contrib-sass')

  grunt.registerTask('test', ['sass', 'clean', 'jasmine'])
  grunt.registerTask('default', ['test'])
}
