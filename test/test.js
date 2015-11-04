/**
 * 
 * Test file for translate.js
 * 
 */

/** dependencies */
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Validator = require('jsonschema').Validator;
var html5Lint = require('html5-lint');

/** empty strings to be populated by HTML content */
var badHTML = '';
var inHTML  = '';
var outHTML = '';
var expHTML = '';

/** empty strings to be populated by JSON content */
var goodJSON = '';
var badJSON  = '';

/** empty arrays to be populated by HTML validation errors */
var inErrors  = [];
var outErrors = [];
var badErrors = [];

/** empty vars to be set to JSON validation error arrays */
var goodJSONErrors;
var badJSONErrors;

/** Validator and schema for JSON validation */
var v = new Validator();
var schema = {
  id: '/locale',
  type: 'object',
  patternProperties: {
    '.*': {
      type: 'object',
      properties: {
        value: {type: 'string'},
        files: {type: 'array'},
      },
    },
  },
  
};

/**
 *
 * Before we run tests, we load all tested HTML and JSON. We then use html5-lint
 * and jsonschema to validate source files and push any errors into respective
 * error arrays for testing in the test suite.
 *
 */

/**
 * void prepareTests
 * @param function callback - the callback to be called when all async functions
 * have been called
 */
var prepareTests = function(callback) {

  /** HTML retrieval and validation */
  var filePath = path.join(__dirname, '../tmp/test/fixtures/index.html');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (!err) {
      inHTML = data;

      html5Lint(inHTML, function(err, results) {
        results.messages.forEach(function(msg) {
          var type = msg.type;
          var message = msg.message;
          var error = '' + type + ': ' + message;
          inErrors.push(error);
        });
      });

    } else {
      console.log('Error getting input html content: ', err);
    }
  });

  filePath = path.join(__dirname, '../tmp/output/test/fixtures/index.html');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (!err) {

      outHTML = data;
      html5Lint(outHTML, function(err, results) {
        results.messages.forEach(function(msg) {
          var type = msg.type;
          var message = msg.message;
          var error = '' + type + ': ' + message;
          outErrors.push(error);
        });
      });

    } else {
      console.log('Error getting output html content: ', err);
    }
  });

  filePath = path.join(__dirname, '../tmp/test/expected/index.html');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (!err) {
      expHTML = data;

    } else {
      console.log('Error getting expected html content: ', err);
    }
  });

  filePath = path.join(__dirname, '../tmp/test/fixtures/invalid/invalid.html');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (!err) {

      badHTML = data;
      html5Lint(badHTML, function(err, results) {
        results.messages.forEach(function(msg) {
          var type = msg.type;
          var message = msg.message;
          var error = '' + type + ': ' + message;
          badErrors.push(error);
        });
        /** callback called here to end async calls */
        callback();
      });
    } else {
      console.log('Error getting invalid html content: ', err);
    }

  });

  
  filePath = path.join(__dirname,
    '../tmp/test/fixtures/locales/de_DE/i18n.json');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (!err) {
      goodJSON = JSON.parse(data);
      goodJSONErrors = v.validate(goodJSON, schema);
    } else {
      console.log('Error getting valid JSON content: ', err);
    }
  });

  filePath = path.join(__dirname, '../tmp/test/fixtures/invalid/invalid.json');
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (!err) {
      badJSON = JSON.parse(data);
      badJSONErrors = v.validate(badJSON, schema);
    } else {
      console.log('Error getting valid JSON content', err);
    }
  });

};

/**
 * The actual test suite to run
 * 
 * These test cases examine the error arrays that were generated
 * earlier, and compares their length with the anticipated amount
 * of returned errors
 */
describe('Mocha Test Suite', function() {

  /** Timeout increased to account for testing in the server */
  this.timeout(25000);

  describe('hooks', function() {

    before(function(done) {
      prepareTests(done);
    });

    describe('check for valid html input', function() {
      it('should be valid html', function() {
        assert.equal(0, inErrors.length);
      });
    });

    describe('check for valid html input', function() {
      it('should be valid html', function() {
        assert.equal(0, outErrors.length);
      });
    });

    describe('check invalid html input for errors', function() {
      it('should be invalid html', function() {
        assert.notEqual(0, badErrors.length);
      });
    });

    describe('check for valid JSON locale file', function() {
      it('should conform to the JSON schema', function() {
        assert.equal(0, goodJSONErrors.errors.length);
      });
    });

    describe('check invalid JSON locale file for errors', function() {
      it('should contain errors', function() {
        assert.notEqual(0, badJSONErrors.errors.length);
      });
    });
    
    describe('Compare output HTML to expected HTML', function() {
      it('should contain the same contents', function() {
        assert.equal(outHTML, expHTML);        
      });
    });

  });
});

