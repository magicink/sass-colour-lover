module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig

    coffeelint :

      source :

        files :
          src : [
            'gruntfile.coffee',
            './src/coffee/**/*.coffee'
          ]

    coffee :

      build :

        options :
          bare : true

        files :
          './build/sass-colour-lover.js' : [
            './src/coffee/sass-colour-lover.coffee'
          ]

    uglify :

      options :

        banner : "#! /usr/bin/env node\r\n"
        beautify : true
        mangle : false

      build :

        files :
          './build/sass-colour-lover.js' : './build/sass-colour-lover.js'

  grunt.registerTask 'default', ['coffeelint','coffee','uglify']
  grunt.registerTask 'test', ['coffeelint']