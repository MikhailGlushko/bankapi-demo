// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info'
const app = express();
const server = http.createServer(app);

app.use(log4js.connectLogger(logger, { level: logger.level }));

// pasha:  It is needed  in routers o services but  not in server
//const serviceManager = require('./services/service-manager');
require('./services/index')(app);

require('./routers/index')(app, server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add your code here
const port =  process.env.SHAPPDB_SERVICE_PORT  || localConfig.port;


/** Right call listen 
 *  in include possibilisty to run application from mocha
*/
if(!module.parent){ 

  server.listen(port, function(){
    logger.info(`nodejswebapp listening on http://localhost:${port}/appmetrics-dash`);
    logger.info(`nodejswebapp listening on http://localhost:${port}`);

  });
}


/** /
 * Commented because it is impossible  running from mocha 
server.listen(port, function(){
  logger.info(`nodejswebapp listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`nodejswebapp listening on http://localhost:${port}`);
});
*/

/*
app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function (err, req, res, next) {
	res.sendFile(path.join(__dirname, '../public', '500.html'));
});
*/
module.exports = server;

