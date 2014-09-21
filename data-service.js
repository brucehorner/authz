/*
 * This is the proxy for a data service.  In the final solution
 * this would fetch from a live data source
 */

/*
 * The global, non subject specific data
 */
module.exports.globalData =
{
  'eligibleCostCenters': ['1234', '53453', '134234', '7657']
};

/*
 * lookup the data for a specific subject
 * this is just hard coded for the evaluation
 * also for the evaluation, create a random delay
 */

module.exports.subjectData = function(subject, callback)
{
  var profile = { 'subject': subject };
  if (subject === 'u1')
  {
    // list of string entitlements
    profile.ents = ['e1','e2', 'e3'];
    profile.emulationAccess = 'Y';
    profile.adminLevel = 3;    
  }
  else if (subject === 'u2')
  {
    profile.internal = true;
    profile.ents = ['e4'];
    profile.eList = ['eResE'];
    // a single attr/value 
    profile.attr1 = 'TRADER';
    profile.adminLevel = 1;
  }
  else if (subject === 'u3')
  {
    profile.ents = ['e3', 'e4'];
    profile.attr1 = 'FINANCE';
  }
  
  // patch up for emulation
  var emulator = profile.emulation_access || 'N';
  if (emulator === 'Y') 
    profile.emulatorAdminLevel = profile.adminLevel;

  return callback(null, profile);
}