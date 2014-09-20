var assert = require('assert');
var core = require ('../core');
var data_service = require('../data-service');

describe('Basic User Data', function()
{
  it('should match profile', function()
	{
    core.get_data('u1', null, function(err, data)
		{
			assert.equal(data['subject'], 'u1');
			assert.equal(data['admin-level'], 3);
			assert.equal(data['eligible-cost-centers'], undefined);
		});
  });
});

describe('Extended User Data', function()
{
  it('should match extended profile', function()
	{
    core.get_data('u1', data_service.global_data, function(err, data)
		{
			assert.equal(data['subject'], 'u1');
			assert.equal(data['admin-level'], 3);
			assert.notEqual(data['eligible-cost-centers'], undefined);			
		});
  });
});







