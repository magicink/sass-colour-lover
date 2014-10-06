module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

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

          './sass-colour-lover.js' : './src/coffee/sass-colour-lover.coffee'

  grunt.registerTask 'default', ['coffeelint','coffee']