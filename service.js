/*
 * This is the authorization service
 * No updates at all here, so only GET request are serviced
 */

var express = require('express');
var app = express();
var core = require('./core');
var router = express.Router();
var pages = require('./pages');
var data_service = require('./data-service.js');

app.use(require('morgan')('dev'));

router.route('/subject')
  .get(function(req, res)			// get all subjects
  {
  	res.send('the (paginated) list of all subjects');
  });
	
router.route('/subject/:id') 
  .get(function(req, res)			// get a specific subject
	{
		var subject  = req.params.id,
		    action   = req.query.action,
		    resource = req.query.resource,
				resources= req.query.resources;
		
		if (subject && action)
		{
			if (resource)	// the simple request with a single resource
			{
				core.authz(subject, action, resource, function(answer)
				{
					res.json(
						{
						'comment' : 'Request for subject authz',
						'subject' : subject,
						'action'  : action,
						'resource': resource,
						'decision': answer
					});				
				});
			}
			else if (resources)	// the multi resource
			{
				res.json({'comment':"it's coming soon"});
				
				// reformat into an array using split()
				// then pass that array to authz_multi_all
			}
			else 	// no idea what the request means
			{
				res.status(400);
				res.end('Unexpected set of query parameters - incomplete/typo?');
			}
		}
		else
		{
			// send the ref data / profile for this subject
			data_service.subject_data(subject, function(profile)
			{
				res.json (
				{ 'comment': 'Simple request for subject',
					'subject': subject,
					'profile': profile
				});				
			});
		}
	});
		
app.use('/api', router);
router.get('/', pages.api_home);
app.get('/', pages.home); 

app.set('title', 'Authorization Service');

var server = app.listen(process.env.PORT || 55555, function()
{
    console.log('Authorization Service listening on port %d', server.address().port);
});
