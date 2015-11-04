/*
 * Grunt-translate-html
 * TODO: - Add public facing Repo, copyright info
 *
 * Copyright (c) 2015 Josh Winskill, Tag Creative
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';

  /** Dependencies */
  var htmlparser = require('htmlparser2');


  /** SingletonTags array - tags that should self close when parsed */
  var singletonTags = ['area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source',];

  /** OutputStr string - the string to ultimately be output as HTML. Must
   * start with a doctype, as the parser does not provide this */  
  var outputStr = '<!DOCTYPE html>';

  /** Options object - default options for grunt task */
  var options = {locale: 'en_US'};

  /** Dest string - default location for translated HTML */
  var dest = 'translated-html';

  /** DestPath string - user added location for translated HTML */
  var destPath = '';

  /** TransObj object - a JSON wrapper that will hold the translation key-
   * value paris */
  var transObj = { translation: '' };

  /** Trans object - the JSON key-value pairs */
  var trans = transObj.translation;

  /** CurrentTag object - the tag used to swap out one translation string
   * with another */
  var currentTag = {
    convertToLocal: false,
    type: '',
    reset: function() {
      this.convertToLocal = false;
      this.type = '';
    },
  };

  /** Parser object - the parser object that fires events in order to
   * build our new HTML string */
  var parser = new htmlparser.Parser({

    /** Onopentag function - the function called on encountering an open
     * HTML tag */
    onopentag: function(name, attributes) {

      outputStr = outputStr.concat('<' + name);

      for (var propertyName in attributes) {
        outputStr = outputStr.concat(' ' + propertyName);
        if (attributes[propertyName]) {
          outputStr = outputStr.concat('="' + attributes[propertyName] + '"');
        }
      }
      outputStr = outputStr.concat('>');

      if (attributes.hasOwnProperty('localize') ||
        attributes.hasOwnProperty('data-localize')) {
        currentTag.type = name;
        currentTag.convertToLocal = true;
      }
    },

    /** Ontext function - the function called on encountering text */
    ontext: function(text) {

      if (currentTag.convertToLocal) {

        /** Text is swapped to localized value here */
        if (trans[text]['value']) {
          outputStr = outputStr.concat(trans[text]['value']);
        }

      } else {

        outputStr = outputStr.concat(text);

      }

    },

    /** Onclosetag function - the function called on encountering a close
     * tag */
    onclosetag: function(name) {

      if (singletonTags.indexOf(name) > -1) {
        return;
      } else {
        var closingTag = '</' + name + '>';
        outputStr = outputStr.concat(closingTag);
        currentTag.reset();
      }
    },

    /** Oncomment function - the function called on encountering a
     * comment tag */
    oncomment: function(data) {
      outputStr = outputStr.concat('<!--' + data + '-->');
    },

    /** Onend function - the function called when parsing has been
     * completed. After parsing is finished, the file is written to
     * the specified path */
    onend: function() {
      destPath = dest + destPath;
      var wasWritten = grunt.file.write(destPath, outputStr);
      if (wasWritten) {
        console.log('wrote ' + destPath + ' successfully');
      } else {
        console.log('Error: ' + destPath + ' was not written successfully');
      }
      outputStr = '<!DOCTYPE html>';
    },

  }, {decodeEntities: true});

  /** Helper Functions */

  /**
   * Parse function - a helper function to parse the data
   * @param data string - the raw HTML data returned from Grunt's file system
   */
  var parse = function(data) {
    parser.write(data);
    parser.end();
  };

  /**
   * Translate - a helper function to grab the JSON translations
   * and call the parse function
   * @param locale string - the string used to represent the appropriate
   * locale, i.e. 'en_US'
   * @param pathToJSON string - the path to the locale folders' root directory
   * @param data string - the raw HTML data returned from Grunt's file system
   */
  var translate = function(locale, pathToJSON, data) {
    pathToJSON = pathToJSON + locale + '/i18n.json';
    if (!grunt.file.exists(pathToJSON)) {
      console.log('Error: locale JSON file not found.');
    }
    transObj = {translation: grunt.file.readJSON(pathToJSON)};
    trans = transObj.translation;

    parse(data);
  };

  /**
   * The grunt task that will be exposed to the user
   * @param arg1 string - an optional command line argument that signifies
   * the locale, i.e. 'en_US'
   */
  grunt.registerMultiTask('translate', function() {

    if (this.options().locale) {
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

};
