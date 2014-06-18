var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function (socket) {
    socket.on('url:put', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      console.log('got text from client: ' + msg);
      socket.emit('url:get', 'short version of ' + msg);
    });
});

router.post('/crunch', function(req, res) {
    var url = req.body;
    console.log('Crunching url: ' + JSON.stringify(url));
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
