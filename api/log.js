var logger = require('winston');

// loggly options
//var Loggly = require('winston-loggly').Loggly;
//var loggly_options={ subdomain: "mysubdomain", inputToken: "efake000-000d-000e-a000-xfakee000a00" }
//logger.add(Loggly, loggly_options);

// log to file
//logger.add(winston.transports.File, { filename: "../logs/production.log" });

//logger.info('Chill Winston, the logs are being captured 3 ways- console, file, and Loggly');

module.exports = logger;