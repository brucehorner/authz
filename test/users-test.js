var assert = require('assert');
var service = require ('../core');
var resources = ['res_a', 'res_b', 'res_c', 'res_d', 'res_e', 'res_f'];
var action = 'read';

var helper = function(subject, results)
{
  resources.forEach(function iterator(resource, index)
	{
		var prediction = results[index];
	  it('Enttitlement to ' + resource + ' should be ' + prediction, function()
		{
	    service.authz(subject, action, resource, function(answer)
			{
		    assert.equal(answer, prediction);
			});
	  });
	});	
}

describe('User1-prime tests', function()
{
  var results = [true, false, false, true, false, true];
	helper('u1', results);
});


describe('User2 tests', function()
{
  var results = [false, true, true, true, true, true];
  helper('u2', results);
});

describe('User3 tests', function()
{
  var results = [false, true, false, true, false, false];
  helper('u3', results);
});