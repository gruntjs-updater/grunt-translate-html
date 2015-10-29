var assert = require('assert');
var fs = require('fs');
var path = require('path');
var translateHtml = require('../tasks/translate.js');
var validator = require('html-validator');
var validatorOpts = {format: 'text'};
var htmlContent = "";

describe('My epic test', function () {
	describe('hooks', function() {
		before(function (done) {
			var filePath = path.join(__dirname, '/fixtures/index.html');
			fs.readFile(filePath, 'utf8', function (err, data) {
				if (!err) {
					htmlContent = data;
					validatorOpts.data = data;
				} else {
					console.log('Error getting html content: ', err);
				}
				
				done();
			});
		});
		
		describe('check for valid html import', function() {
			it('should be valid html', function(done) {
				validator(validatorOpts, function(err, data) {
					console.log('err: ', err);
					assert.equal(null, err);
					
					done();	
				});
			});
		});
	});	
});

