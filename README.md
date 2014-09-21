#Authorization Service#
Very simple javascript service which implements a centralized data attribute source with set of rules also implemented in javascript. 

##Components
###core ###

###rules ###

```js
  // match a specific string in a list, data driven policy
  resE: function (data, action) {
    var list = data.eList;
    if (list)
       return list.indexOf('eResE') > -1;
    else
       return false;
  }
```	
###data-service ###

###service ###


