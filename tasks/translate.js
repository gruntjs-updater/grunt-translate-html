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
    var options = {locale: 'en_US'};
    var dest = 'translated-html';
    var destPath = '';
    var transObj = {translation: ''};
    var trans = transObj["translation"];
    
    // Tag we use while parsing to swap out translations
    var currentTag = {
        convertToLocal: false,
        type: '',
        reset: function() {
            this.convertToLocal = false;
            this.type = '';
        }
    };
    
    // Parser
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
            destPath = dest + destPath;
            var wasWritten = grunt.file.write(destPath, outputStr);
            if (wasWritten) {
                console.log('wrote ' + destPath + 'successfully');
            } else {
                console.log('Error: ' + destPath + ' was not written successfully');
            }
            outputStr = "<!DOCTYPE html>";
        }
        
    }, {decodeEntities: true});
  
  
    //helper functions
    var parse = function(data) {
        parser.write(data);
        parser.end();
    };
    
    var translate = function(loc, pathToJSON, data) {
        pathToJSON = pathToJSON + loc + '/i18n.json';
        if (!grunt.file.exists(pathToJSON)) {
            console.log('Error: locale JSON file not found. Check the locale directory path and locale name.');
        }
        transObj = {translation: grunt.file.readJSON(pathToJSON)};
        trans = transObj['translation'];
       
        parse(data);
    }
  
    //grunt task
    grunt.registerMultiTask('translate', function(arg1) {
        if (arg1) {
            options.locale = arg1;
        } else if (this.options().locale) {
            options.locale = this.options().locale;
        }
        if (this.files[0]['dest']) {
            dest = this.files[0]['dest'];
        }
        if (!this.options().pathToLocFolders) {
            console.log('Error: Specify the directory for your locale folders');
            return;
        } else {
            options.pathToLocFolders = this.options().pathToLocFolders;
        }

        this.files.forEach(function(file) {
            file.src.filter(function(filepath) {
               if (!grunt.file.exists(filepath)) {
                   grunt.log.warn('Source file ' + filepath + 'not fount');
               } else {
                   return true;
               }
            }).map(function(filepath) {
                var data = grunt.file.read(filepath);
                destPath = filepath;
                translate(options.locale, options.pathToLocFolders, data);
            });
        });
    });
}
