/*
 * grunt-translate-html
 * https://github.com/Josh/grunt plugin
 *
 * Copyright (c) 2015 Josh Winskill, Tag Creative
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';

  // variables for parsing through HTML document
  var htmlparser = require("htmlparser2");
  var singletonTags = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "link", "meta", "param", "source"];
  var outputStr = "<!DOCTYPE html>";
  var currentTag = {
    convertToLocal: false,
    type: '',
    reset: function() {
        this.convertToLocal = false;
        this.type = '';
    }
  };
  var parser = new htmlparser.Parser({

    onopentag: function(name, attributes) {

        outputStr = outputStr.concat("<" + name);

        for(var propertyName in attributes) {
            outputStr = outputStr.concat(" " + propertyName);
            if (attributes[propertyName]) {
                outputStr = outputStr.concat("=\"" + attributes[propertyName] + "\"");
            }
        }
        outputStr = outputStr.concat(">");

        if (attributes.hasOwnProperty("localize") || attributes.hasOwnProperty("data-localize")) {
            currentTag.type = name;
            currentTag.convertToLocal = true;
        }
    },

    ontext: function(text){

        if (currentTag.convertToLocal) {

            //localize text
            if (trans[text]['value']) {
                outputStr = outputStr.concat(trans[text]['value']);
            }

        } else {

            outputStr = outputStr.concat(text);

        }

    },

    onclosetag: function(name) {

        if (singletonTags.indexOf(name) > -1) {
            return;
        } else {
            var closingTag = '</' + name + '>';
            outputStr = outputStr.concat(closingTag);
            currentTag.reset();
        }
    },

    oncomment: function(data) {
        outputStr = outputStr.concat('<!--' + data + '-->');
    },

    onend: function() {
        console.log("output string: ", outputStr);
        grunt.file.write('build/index.html', outputStr);
    }

}, {decodeEntities: true});

var geraldine = function(arg1) {
  grunt.log.writeln('geraldine');
  if (arg1) {
    grunt.log.writeln('more geraldine');
  }
}

  grunt.registerTask('translate', 'do something.', function() {

    var opts = this.options();

  });
  

};
