var assert = require('assert');
var core = require('../core');
var dataService = require('../data-service');

describe('Basic User Data', function()
{
  it('should match profile', function()
  {
    core.getData('u1', null, function(err, data)
    {
      assert.equal(data.subject, 'u1');
      assert.equal(data.adminLevel, 3);
      assert.equal(data.eligibleCostCenters, undefined);
    });
  });
});

describe('Extended User Data', function()
{
  it('should match extended profile', function()
  {
    core.getData('u1', dataService.globalData, function(err, data)
    {
      assert.equal(data.subject, 'u1');
      assert.equal(data.adminLevel, 3);
      assert.notEqual(data.eligibleCostCenters, undefined);      
    });
  });
});