
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug', timestamp: true, colorize: true })
  ]
});

exports.logger = logger;
