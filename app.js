var grunt = require('grunt');
var gruntFile = require('./Gruntfile.js');

gruntFile(grunt);

grunt.tasks(['test']);