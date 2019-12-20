var express = require('express');
var helmet = require('helmet');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
require('dotenv').config({path : './config/.env'});

const config = process.env;
var api = new ParseServer({
  databaseURI: config.databaseUri ,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId:  config.appId,
  masterKey: config.masterKey,
  serverURL: config.serverURL,
  silent : true,
  //logsFolder:process.env.PARSE_SERVER_LOGS_FOLDER
});

//var options = { allowInsecureHTTP: false };
var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": config.serverURL,
      "appId" :  config.appId,
      "masterKey": config.masterKey,
      "appName": config.appName
    }
  ]
});
var app = express();
app.use(express.static('public'))
//set template engine
app.set('view engine', 'ejs');
app.use(helmet());
// make the Parse Server available at /parse
app.use('/parse', api);
// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

var port=config.PORT;
app.set('port',port);

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});

var httpServer = require('http').createServer(app);
httpServer.listen(app.get('port'), function() {
    console.log('YourSaathi Parse server running on port ' + app.get('port') + '.');
});
