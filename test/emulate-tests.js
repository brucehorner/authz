var assert = require('assert');
var service = require ('../core');
var action = 'emulate';

var helper = function(subject, resource, correct_result)
{
  it('should be ' + correct_result, function()
	{
    service.authz(subject, action, resource, function(result)
		{
			assert.equal(result, correct_result);
		});
  });
	
}

describe('User 1 can emulate User 2', function()
{
	helper('u1', 'u2', true);
});

describe('User 1 can emulate User 3', function()
{
	helper('u1', 'u3', false);
});

describe('User 2 can emulate User 1', function()
{
	helper('u2', 'u1', false);
});



