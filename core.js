/*
 * The service (at least proxy for it)
 * 1. source data
 * 2. link to rules
 * 3. expose simple service API
 */
var _ = require('underscore');
var async = require('async');
var rules = require ('./rules');
var dataService = require ('./data-service');

// consider pulling the relatively constant global data from 
// the data service into a module level variable

/*
 * the primary authorization function
 */ 
var authz = function (subject, action, resource, callback)
{
  getData(subject, dataService.globalData, function(err, data)
	{
	  invokeRule(data, action, resource, function(err, result)
		{
			return callback(err, result);
		});	
	});
}


var authzMultiAllParallel = function (subject, actions, resources, callback)
{
  var calls = [];
  var response = [];
  getData(subject, dataService.globalData, function(data)
	{  	
		// build up the array of functions to call
	  actions.forEach(function actionIterator(action)
		{
	    resources.forEach(function resourceIterator(resource)
			{
		    var callback = function (err, answer)
				{
	        response.push(
						{
							'subject':  subject,
							'action' :  action,
							'resource': resource,
							'decision': answer
						});        
		    };

		    calls.push(invokeRuleAsync(callback, data, action, resource));
	    });
	  });

	  async.parallel(calls, function handler(err, results)
		{
	    console.log ('all results', results);
	  });

	  return callback(response);
  });
}

// internal to wrap the rule evaluation given all data in place
var invokeRule = function (data, action, resource, callback)
{
  var inContextRule = rules[resource];
  if (inContextRule)
	{
    return callback(null, inContextRule(data, action));  
	}
	
	// set up for the very odd case of emulation
	// where the action is emulate
	// emulator is the subject
	// emulatee is the resource
	if (action == 'emulate')
	{
		getData(resource, null, function(err, emulateeData)
		{
			data.emulatorId = data.subject;
			data.emulatorAdminLevel = data.adminLevel;
			data.adminLevel = emulateeData.adminLevel;
			return callback(null, rules.canEmulateOrViewPB(data, action));				
		});
	}
  else
	{
   	// attempt to use an unexpected function/resource
		console.log('ERROR: Unknown rule for resource', resource);
   	return callback(null, false);
	}
}

// rule invocation with callback to work with async module
var invokeRuleAsync = function (callback, data, action, resource)
{
  invokeRule(data, action, resource, function(err, result)
	{
  	callback(err, result);
  });
}

// helper to get subject-specific data and merge that 
// with global data
var getData = function(subject, globalData, callback)
{
  dataService.subjectData(subject, function process(err, subjectData)
	{
		if (globalData)
		  callback(null, _.extend(subjectData, globalData));
		else
			callback(null, subjectData);
	});
}

module.exports.authz = authz
module.exports.authzMultiAll = authzMultiAllParallel
module.exports.getData = getData