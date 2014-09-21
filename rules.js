/*
 * This is the rules listing.  Nothing else goes here.
 * Expectations:
 * 1. each resource has just one function, which has the same name
 * 2. all entitlements data and requested action are passed
 * 3. response is true/false
 * 4. no real error handling here, missing entitlements and attributes are normal
 * 5. some text protocol here, such as standard entitlements are in array called 'ents'
 */

module.exports = {
  // a simple AND 
  resA: function (data, action) {
    return resAImpl(data, action);
  },

  // NOT of the simple AND 
  resB: function (data, action) {
    return !resAImpl(data, action);
  },

  // use a shared function, check for "internal"
  resC: function (data, action) {
    return isInternal(data);
  },

  // a simple OR
  resD: function (data, action) { 
    return hasEntitlement(data, 'e3') || hasEntitlement(data, 'e4');
  },

  // match a string in a resource-list, data driven policy
  resE: function (data, action) {
    var list = data.eList;
    if (list)
       return list.indexOf('eResE') > -1;
    else
       return false;
  },

  // the modern attribute-driven with fixed entitlement fallback
  resF: function(data, action) {
    return (isInternal(data) && data.attr1 === 'TRADER')
                 ||
            hasEntitlement(data, 'e1');    
  },
	
	// the PB emulation rule
	canEmulateOrViewPB: function(data, action)
	{
		// not allowed if no emulator id
		if (!data.emulatorId)
		  return false;
			
		if (action === 'show' || action === 'emulate')
		{
			var emulationAccess    = data.emulationAccess;
			var emulatorAdminLevel = data.emulatorAdminLevel;
			var emulateeAdminLevel = data.adminLevel;
			if (!emulationAccess || !emulatorAdminLevel || !emulateeAdminLevel)
			  return false;
					
			if ((emulationAccess === 'Y') && (emulatorAdminLevel >= 1)
			  && ( (emulateeAdminLevel === 0)
					   ||
					   (emulatorAdminLevel > emulateeAdminLevel)
				   ))
			{
			  	return true;
		  }
		}
		return false;
	}
}

// helper function to confirm if an entitlement is present
var hasEntitlement = function hasEntitlement(data, ent) {
  var entitlementsArray = data.ents;
  if (entitlementsArray) 
	{
		var x = entitlementsArray.indexOf(ent);
    return x > -1;
	}
  
  return false;
}

// a shared implementation
var resAImpl = function resAImpl(data, action) {
  return hasEntitlement(data,'e1') && hasEntitlement(data,'e2');
}

var isInternal = function isInternal(data) {
  var answer = data.internal;
  if (answer)
		return answer === true;
		
	return false;
}