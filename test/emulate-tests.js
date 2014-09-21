var assert = require('assert');
var service = require ('../core');
var action = 'emulate';

var helper = function(subject, resource, correctResult)
{
  it('should be ' + correctResult, function()
	{
    service.authz(subject, action, resource, function(err, result)
		{
			assert.equal(result, correctResult);
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



