module.exports = (grunt) ->

  grunt.initConfig

    sass:
      all:
        expand: true
        flatten: true
        src: ['src/*.sass']
        dest: 'dist/assets'
        ext: '.css'
      options:
        sourcemap: 'none'

    autoprefixer:
      all:
        expand: true
        flatten: true
        src: ['dist/assets/*.css']
        dest: 'dist/assets'
        ext: '.css'

    cssmin:
      options:
        report: 'gzip'
      dist:
        files:
          'dist/assets/main.css': 'dist/assets/main.css'

    browserify:
      dev:
        files:
          'dist/assets/bundle.js': 'src/main.jsx'
        options:
          browserifyOptions:
            debug: true
            extensions: ['.jsx', '.coffee']
      dist:
        files:
          'dist/assets/bundle.js': 'src/main.jsx'
        options:
          browserifyOptions:
            debug: false
            extensions: ['.jsx', '.coffee']
            fullPaths: false
      options:
        watch: true
        transform: [
          'coffeeify'
          ['reactify', {'es6': true}]
          'browserify-shim'
        ]

    uglify:
      'dist/assets/bundle.js': 'dist/assets/bundle.js'
      options:
        report: 'gzip'

    copy:
      assets:
        expand: true
        cwd: 'dist'
        src: 'assets/**'
        dest: 'public'
      theme:
        expand: true
        cwd: 'dist/theme/'
        src: '**'
        dest: 'public/wp/wp-content/themes/dotby.jp/'
      bottheme:
        expand: true
        cwd: 'dist/bot-theme/'
        src: '**'
        dest: 'public/wp/wp-content/themes/twentyfifteen-bot/'

    watch:
      sass:
        files: ['src/**/*.sass']
        tasks: ['sass', 'autoprefixer']
      dist:
        files: ['dist/**/*']
        tasks: ['copy']
        options:
          livereload: true

    rsync:
      options:
        ssh: true
        args: ['--stats']
        exclude: ['.*']
        recursive: true
        delete: true
#        dryRun: true
      assets:
        options:
          src: './dist/assets/'
          dest: 'dotby:/var/www/html/assets/'
      theme:
        options:
          src: './dist/theme/'
          dest: 'dotby:/var/www/html/wp/wp-content/themes/dotby.jp/'
      bottheme:
        options:
          src: './dist/bot-theme/'
          dest: 'dotby:/var/www/html/wp/wp-content/themes/twentyfifteen-bot/'

    express:
      server:
        options:
          server: 'server.coffee'
          bases: 'dist'
          hostname: '*'
          port: 8000
#          serverreload: true

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-autoprefixer')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-rsync')
  grunt.loadNpmTasks('grunt-express')
  grunt.registerTask('default', ['express', 'sass', 'autoprefixer', 'browserify:dev', 'copy', 'watch'])
  grunt.registerTask('build', ['sass', 'autoprefixer', 'cssmin', 'browserify:dist', 'uglify', 'copy'])
  grunt.registerTask('deploy', ['build', 'rsync'])
