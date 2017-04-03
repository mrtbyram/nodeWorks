var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/base', express.static('/Users/muratbayram/git/nodeWorks'));

app.get('/', function(req, res){
  res.sendFile('/Users/muratbayram/git/nodeWorks/client.html');
});

var userMap = {};

io.on('connection', function(socket){
	// console.log(socket);
	// socket.on('disconnect', function(){
	// 	console.log('disconnected');
	// })

	for (var key in userMap) {
	  if (userMap.hasOwnProperty(key)) {
	  	socket.emit('user connected',key);
	  }
	}

	socket.on('username', function(msg){
		console.log('user connected' + msg);
		socket.broadcast.emit('user connected',msg);
		userMap[msg] = socket;
	});

	socket.on('messageServer', function(msg){
		// socket.broadcast.emit('user connected',msg);
		console.log(msg.toUser);
		console.log(msg.msg);
		// console.log(userMap[msg.toUser]);
		userMap[msg.toUser].emit('messageClient', msg.msg);
	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});