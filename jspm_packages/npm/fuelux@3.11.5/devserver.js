/* */ 
(function(process) {
  var util = require('util');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var path = require('path');
  var port = 9000;
  var app = connect();
  app.use(serveStatic(path.resolve(__dirname)));
  app.listen(process.env.PORT || port);
  util.puts('Listening on ' + (process.env.PORT || port) + '...');
  util.puts('Press Ctrl + C to stop.');
})(require('process'));
