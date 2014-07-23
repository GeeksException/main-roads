var http = require('http');
var path = require('path');

var express = require('express');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'public')));

router.get('/2', function (req, res) {
    res.sendfile('public/prototype2.html');
});

var port = Number(process.env.PORT || 5000);

server.listen(port, function() {
   console.log("Listening on localhost:" + port); 
});