var assert = require('assert');
var fs = require('fs');
var path = require('path');
var validator = require('w3c-validate').createValidator();
var html5Lint = require('html5-lint');

var badHTML = '';
var inHTML  = '';
var outHTML = '';
var expHTML = '';

var inErrors  = [];
var outErrors = [];
var badErrors = [];

// Get all HTML to be tested

var prepareTests = function(callback) { 

var filePath = path.join(__dirname, '../tmp/test/fixtures/index.html');
fs.readFile(filePath, 'utf8', function (err, data) {
	if (!err) {
		inHTML = data;
		console.log('inHTML received');
		
		html5Lint(inHTML, function(err, results) {
			console.log('inHTML: ' + inHTML);
			results.messages.forEach(function(msg) {
				var type = msg.type;
				var message = msg.message;
				var error = '' + type + ': ' + message;
				console.log(error);
				inErrors.push(error);
			});
		});
		
	} else {
		console.log('Error getting input html content: ', err);
	}
});

filePath = path.join(__dirname, '../tmp/output/test/fixtures/index.html');
fs.readFile(filePath, 'utf8', function (err, data) {
	if (!err) {
		outHTML = data;
		
		html5Lint(outHTML, function(err, results) {
			results.messages.forEach(function(msg) {
				var type = msg.type;
				var message = msg.message;
				var error = '' + type + ': ' + message;
				console.log(error);
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
		console.log('expHTML received');
	} else {
		console.log('Error getting expected html content: ', err);
	}
});

filePath = path.join(__dirname, '../tmp/test/fixtures/invalid/invalid.html');
fs.readFile(filePath, 'utf8', function (err, data) {
	if (!err) {
		badHTML = data;
		html5Lint(badHTML, function(err, results) {
			results.messages.forEach(function(msg) {
				var type = msg.type;
				var message = msg.message;
				var error = '' + type + ': ' + message;
				console.log(error);
				badErrors.push(error);
			});
			callback();
		});
	} else {
		console.log('Error getting invalid html content: ', err);
	}
	
});

};

// Generate error arrays for input, output, and invalid HTML

describe('Mocha Test Suite', function () {
	
	// Timeout increased to account for testing in the server
	this.timeout(10000);
	
	describe('hooks', function() {
		
		before(function (done) {
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
		
		describe('check for valid html input', function() {
			it('should be valid html', function() {
				assert.notEqual(0, badErrors.length);
			});
		});
		
	});
});

