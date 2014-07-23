var http = require('http');
var path = require('path');

var express = require('express');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'public')));

var port = 1337;

server.listen(port, function() {
   console.log("Listening on localhost:" + port); 
});