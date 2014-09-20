/*
 * This is the proxy for a data service.  In the final solution
 * this would fetch from a live data source
 */

/*
 * The global, non subject specific data
 */
module.exports.global_data =
{
  'eligible-cost-centers': ['1234', '53453', '134234', '7657']	
};

/*
 * lookup the data for a specific subject
 * this is just hard coded for the evaluation
 * also for the evaluation, create a random delay
 */

module.exports.subject_data = function(subject, callback)
{
	var delay = 50 + Math.random()*50;
	setTimeout(function retrieve_data()
	{
		var subject_data = { 'subject': subject };
		if (subject == 'u1')
		{
			// list of string entitlements
			subject_data['ents'] = ['e1','e2', 'e3'];
			subject_data['emulation-access'] = 'Y';
			subject_data['admin-level'] = 3;		
		}
		else if (subject == 'u2')
		{
			subject_data['internal'] = true;
			subject_data['ents'] = ['e4'];
			subject_data['e-list'] = ['e_res_e'];
			// a single attr/value 
			subject_data['attr1'] = 'TRADER';
			subject_data['admin-level'] = 1;		
		}
		else if (subject == 'u3')
		{
			subject_data['ents'] = ['e3', 'e4'];
			subject_data['attr1'] = 'FINANCE';
		}
	
		// patch up for emulation
		var emulator = subject_data['emulation-access'] || 'N';
		if (emulator == 'Y')
		subject_data['emulator-admin-level'] = subject_data['admin-level'];		

		callback(subject_data);
	}, delay);
}
