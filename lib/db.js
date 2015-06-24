
var pgpLib = require('pg-promise');
var Promise = require("bluebird");


module.exports = function (env, logger)
{
	var self = {};

	var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'teralytics',
    user: 'vicpostgres',
    password: 'vicpostgres'
	};

	var options = {
  	promiseLib: Promise,
		/*
		connect: function(client) {
			var cp = client.connectionParameters;
      logger.info("Connected to database '" + cp.database + "'");
    },
		*/
		error: function (err, e) {
      logger.error("DB Error: " + err);

			if (e.cn) {
        logger.error(cn);
      }

      if (e.query) {
        logger.warn("Query:", e.query);
        if (e.params) {
          logger.warn("Parameters:", e.params);
        }
      }
      if (e.ctx) {
        logger.error(e.ctx);
      }
    }
	};

	var pgp = pgpLib(options)

	// exposing the db is probably not a good idea
	self.db = pgp(cn);


	self.getTileData = function(left, top, right, bottom) {

		var query = '\
		SELECT osm_name As properties, ST_ASGEOJSON(geom_way) as geometry \
		FROM ch_2po_4pgr \
		WHERE ST_Intersects(ch_2po_4pgr.geom_way, \
			ST_SetSRID(ST_MakeBox2D(ST_Point($1, $2), ST_Point($3, $4)), 4326))';

		return self.db.query(query, [left, top, right, bottom]);

	}

	return self;

};
