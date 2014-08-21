module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    shell: {
      options: {
        stdout: true
      },
      start: {
        command: 'npm start'
      },
      stop: {
        command: 'npm stop'
      }
    },

    mochaTest: {
      unit: {
        options: {
          reporter: 'spec'
        },
        src: ['test.js', 'test/{,**/}*.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'index.js',
        'lib/{,**/}*.js',
        'test.js',
        'test/{,**/}*.js'
      ]
    },

    watch: {
      assets: {
        options: {
          livereload: 7777
        },
        files: ['public/{,**}/*']
      },
      mocha_unit: {
        files: ['index.js', 'lib/{,**}/*.js', 'test.js', 'test/{,**/}*.js'],
        tasks: ['mochaTest:unit']
      }
    },

    open: {
      app: {
        path: 'http://localhost:8080'
      }
    }

  });

  // grunt.registerTask('test', ['jshint', 'test:unit']);
  grunt.registerTask('test', ['test:unit']);
  grunt.registerTask('test:unit', ['mochaTest:unit']);

  grunt.registerTask('autotest', ['autotest:unit']);
  grunt.registerTask('autotest:unit', ['watch:mocha_unit']);

  grunt.registerTask('start', ['shell:start']);
  grunt.registerTask('dev', ['shell:start', 'open:app']);

  grunt.registerTask('default', ['dev']);
};
