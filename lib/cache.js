
var NodeCache = require("node-cache");

module.exports = function (env, logger)
{
	var self = {};

  var cache = new NodeCache({ stdTTL: 600, checkperiod: 180 });

  self.set = function (key, value) {
		return cache.set(key, value);
	}

	self.get = function (key) {
		return cache.get(key);
	}

	self.getStats = function () {
		return cache.getStats();
	}

  return self;
}
