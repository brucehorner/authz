/*
 * The service (at least proxy for it)
 * 1. source data
 * 2. link to rules
 * 3. expose simple service API
 */
var rules = require ('./rules');
var _ = require('underscore');
var async = require('async');
var data_service = require ('./data-service');

// consider pulling the relatively constant global data from 
// the data service into a module level variable
// const global_data = data_service.global_data;

/*
 * the primary authorization function
 */ 
var authz = function (subject, action, resource, callback)
{
  get_data(subject, data_service.global_data, function(data)
	{
	  invoke_rule(data, action, resource, function(result)
		{
			callback(result);
		});	
	});
}


var authz_multi_all_parallel = function (subject, actions, resources, callback)
{
  var calls = [];
  var response = [];
  get_data (subject, data_service.global_data, function(data)
	{  	
		// build up the array of functions to call
	  actions.forEach(function action_iterator(action)
		{
	    resources.forEach(function resource_iterator(resource)
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

		    calls.push(invoke_rule_async(callback, data, action, resource));
	    });
	  });

	  async.parallel(calls, function handler(err, results)
		{
	    console.log ('all results', results);
	  });

	  callback(response);
		
  });
}

// internal to wrap the rule evaluation given all data in place
var invoke_rule = function (data, action, resource, callback)
{
  var f = rules[resource];
  if (f)
	{
    callback(f(data, action));  
	}
	else
	{
		// set up for the very odd case of emulation
		// where the action is emulate
		// emulator is the subject
		// emulatee is the resource
		if (action == 'emulate')
		{
			get_data(resource, null, function(emulatee_data)
			{
				data['emulator-id'] = data['subject'];
				data['emulator-admin-level'] = data['admin-level'];
				data['admin-level'] = emulatee_data['admin-level'];
				callback(rules['can_emulate_or_view_PB'](data, action));				
			});
		}
    else
		{
    	// attempt to use an unexpected function/resource
			console.log('ERROR: Unknown rule for resource', resource);
    	callback(false);
		}
	}
}

// rule invocation with callback to work with async module
var invoke_rule_async = function (callback, data, action, resource)
{
  invoke_rule(data, action, resource, function(result){
  	callback(null, result);
  });
}

// helper to get subject-specific data and merge that 
// with global data
var get_data = function(subject, global_data, callback)
{
  data_service.subject_data(subject, function process(subject_data)
	{
		if (global_data)
		  callback(_.extend(subject_data, global_data));
		else
			callback(subject_data);
	});
}


module.exports.authz = authz
module.exports.authz_multi_all = authz_multi_all_parallel
module.exports.get_data = get_data