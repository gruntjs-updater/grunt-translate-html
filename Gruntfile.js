/*
 * grunt-translate-html
 * https://github.com/Josh/grunt plugin
 *
 * Copyright (c) 2015 Josh Winskill, Tag Creative
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Copy files for the test setup:
    copy: {
      main: {
        files: [
          {
            src: 'test/expected/*',
            dest: 'tmp/',
            expand: true,
            flatten: true,
            filter: 'isFile'
          }
        ]
      }
    },

    // Configuration to be run (and then tested).
    translate: {
      options: {
        locale: 'en_US',
        pathToLocFolders: 'test/fixtures/locales/'
      },
        files: {
          src: 'test/fixtures/**/*.html',
          dest: 'tmp/'
        }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    // Mocha tests
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',          
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/**/*.js']
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-locales');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'translate']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'mochaTest']);

};
