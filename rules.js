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
  res_a: function (data, action) {
    return res_a_impl(data, action);
  },

  // NOT of the simple AND 
  res_b: function (data, action) {
    return !res_a_impl(data, action);
  },

  // use a shared function, check for "internal"
  res_c: function (data, action) {
    return is_internal(data);
  },

  // a simple OR
  res_d: function (data, action) { 
    return has_entitlement(data, 'e3') || has_entitlement(data, 'e4');
  },

  // match a string in a resource-list, data driven policy
  res_e: function (data, action) {
    var list = data['e-list'];
    if (list)
       return list.indexOf('e_res_e') > -1;
    else
       return false;
  },

  // the modern attribute-driven with fixed entitlement fallback
  res_f: function(data, action) {
    return (is_internal(data) && data['attr1'] === 'TRADER')
                 ||
            has_entitlement(data, 'e1');    
  },
	
	// the PB emulation rule
	can_emulate_or_view_PB: function(data, action)
	{
		if (!data['emulator-id']) return false;	// not allowed if no emulator id
		if (action == 'show' || action == 'emulate')
		{
			var emulation_access     = data['emulation-access'],
			    emulator_admin_level = data['emulator-admin-level'],
			    emulatee_admin_level = data['admin-level'];
			if (!emulation_access || !emulator_admin_level || !emulatee_admin_level) return false;
					
			if ((emulation_access == 'Y') && (emulator_admin_level >= 1)
			  && ( (emulatee_admin_level == 0)
					   ||
					   (emulator_admin_level > emulatee_admin_level)
				   ))
			{
			  	return true;
		  }
		}
		return false;
	}
}

// helper function to confirm if an entitlement is present
var has_entitlement = function(data, ent) {
  var entitlements_array = data['ents']
  if (entitlements_array) 
	{
		var x = entitlements_array.indexOf(ent);
    return x > -1;
	}
  else
    return false;
}

// a shared implementation
var res_a_impl = function(data, action) {
  return has_entitlement(data,'e1') && has_entitlement(data,'e2');
}

var is_internal = function(data) {
  var answer = data['internal'];
  if (answer) return answer==true; else return false;
}