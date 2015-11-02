var assert = require('assert');
var fs = require('fs');
var path = require('path');
var validator = require('html-validator');
var inValidatorOpts  = {format: 'text'};
var outValidatorOpts = {format: 'text'};
var expValidatorOpts = {format: 'text'};
var outContent = "";
var expContent = "";


describe('Mocha Test Suite', function () {
	this.timeout(15000);
	describe('hooks', function() {
		before(function (done) {
			var filePath = path.join(__dirname, '../tmp/test/fixtures/index.html');
			fs.readFile(filePath, 'utf8', function (err, data) {
				if (!err) {
					inValidatorOpts.data = data;
				} else {
					console.log('Error getting input html content: ', err);
				}
			});
			filePath = path.join(__dirname, '../tmp/output/test/fixtures/index.html');
			fs.readFile(filePath, 'utf8', function (err, data) {
				if (!err) {
					outValidatorOpts.data = data;
					outContent = data;
				} else {
					console.log('Error getting output html content: ', err);
				}
			});
			filePath = path.join(__dirname, '../tmp/test/expected/index.html');
			fs.readFile(filePath, 'utf8', function(err, data) {
				if (!err) {
					expValidatorOpts.data = data;
					expContent = data;
					done();
				} else {
					console.log('Error getting expected html content: ', err);
				}
			})
		});
		
		describe('check for valid html input', function() {
			it('should be valid html', function(done) {
				validator(inValidatorOpts, function(err, data) {
					if (err) {
						console.log('ERROR: ', err);
						assert.equal(true, false);					
					}
					assert.equal(null, err);
					done();	
				});
			});
		});
		
		describe('check for valid html output', function() {
			it('should be valid html', function(done) {
				validator(outValidatorOpts, function(err, data) {
					if (err) {
						console.log('ERROR: ', err);
						assert.equal(true, false);
					}
					assert.equal(null, err);
					done();
				});
			});
		});
		
		describe('check if the output html matches the expected result', function() {
			it('output should match expected html', function(done) {
				assert.equal(expContent, outContent);
				done();
			});
		})
	});
});

