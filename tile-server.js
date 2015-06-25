

//
// global modules
//

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');

var Promise = require('bluebird');

//
// local modules
//

var logger = require('./lib/logger.js').logger;
var db = require('./lib/db.js')('production', logger);
var cache = require('./lib/cache.js')('production', logger);
var cors = require('./lib/cors');
var util = require('./lib/util');

//
// static config
//

var env = process.env.NODE_ENV || 'development';

var app_port = 9000;
var api_port = 9001;


//
// setup
//

var app = express();
var api = express();

//
// app middleware
//

app.use(morgan('dev'));

if ('development' == env) {
  app.use(errorHandler());
}

//
// api middleware
//

api.use(bodyParser.json());
api.use(morgan('dev'));
api.use(cors.allowAll);

//
// util
//

var parseResult = function (result) {

  return new Promise(function (resolve) {

    var features = [];
    var featureCollection = {};
    featureCollection.type = 'FeatureCollection';

    for (var r = 0 ; r < result.length ; r++) {

      var feature = {};
      feature.type = 'Feature';


      if (result[r].geometry) {
        feature.geometry = JSON.parse(result[r].geometry);
      }

      features.push(feature);
    }

    featureCollection.features = features;

    resolve(featureCollection);

  });
}

//
// setup
//

function init()
{

  //
  // app routes
  //

  app.use(express.static(__dirname + '/public'));

  //
  // api routes
  //

  api.get('/', function (req, res, next) {
    res.send('yo');
  });

  api.get('/stats/cache', function (req, res, next) {

    res.send(cache.getStats());

  });

  api.get('/tiles/vector/:z/:x/:y', function (req, res, next) {

    try {

      var z = parseInt(req.params.z);
      var x = parseInt(req.params.x);
      var y = parseInt(req.params.y);

      var key = z + '-' + x + '-' + y;

      var c = cache.get(key);

      if (c) {
        res.send(c);
        return;
      }

      var box = util.getLTRBbox(z, x, y);

      db.getTileData(box.left, box.top, box.right, box.bottom)
        .then(function (data) {

          return parseResult(data);

        })
        .then(function (featureCollection) {

          cache.set(key, featureCollection);
          res.send(featureCollection);

        })
        .catch(function (err) {
          logger.error(err);
          next(err);
        });


    } catch (err) {

      logger.error(err);
      next(err);
    }

  });

  //
  // error handling
  //

  app.use(function (err, req, res, next) {

    logger.error(err);
    res.header('Error', err);
    res.status(500).send();

  });

  api.use(function (err, req, res, next) {

    logger.error(err);
    res.header('Error', err);
    res.status(500).send();

  });

  //
  // setup
  //

  var app_http = app.listen(app_port);
  logger.info('app listening on ' + app_port);

  var api_http = api.listen(api_port);
  logger.info('api listening on ' + api_port);


  logger.info('running in ' + env);
}

//
// exposed elements
//

exports.app = app;
exports.api = api;
exports.db = db;

exports.init = init;

if (!module.parent)
{
  init();
};
