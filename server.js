var http = require('http');
var path = require('path');
var async = require('async');
var mongo = require('mongoskin');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

// Database Connection
var db     = mongo.db('mongodb://nerd:dork@kahana.mongohq.com:10079/crunchy');
var urls   = db.collection('urls');

io.on('connection', function (socket) {
    socket.on('url:put', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      console.log('got text from client: ' + msg);
      
      // insert url to db
      // id will be it's key, already indexed, made for small use case
      urls.insert({url:msg}, function(err, record){
          if (err) throw err;
          socket.emit('url:get', record);
      });
      
    });
});

// Re-router for short url pings
router.get('/:id', function(req, res) {
    console.log(req.params.id);
    urls.find({ _id: req.params.id }, function(err, record){
        // Redirect to URL
        res.redirect(record.url);
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
