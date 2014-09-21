/*
 * rendering for the HTML content of the Authorization Service
 */


module.exports.home = function(req, res)
{
	res.end ('Welcome to the Authorization Service home page!');
};

module.exports.apiHome = function(req, res)
{
  res.send('Welcome to the Authorization Service API!');
}