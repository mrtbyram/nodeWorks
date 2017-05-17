var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/base', express.static('./'));

app.get('/', function(req, res){
  res.sendFile(path.resolve('gameClient.html'));
});

var userMap = {};
var colors = ['red', 'blue', 'green', 'yellow', 'black'];
var userNumber = 0;

io.on('connection', function(socket){
	if(userNumber == colors.length){
		socket.emit('full');
	}else{
		var color = colors[userNumber];
		var username = 'user' + color;
		userNumber = userNumber + 1;

		console.log(username + ' connected');
		socket.emit('initial', {username: username, color:color});

		socket.broadcast.emit('newUser', {username: username, color:color});
	}

	socket.on('movement', function(data){
		// console.log('username:'+data.username+' X:'+data.left+' Y:'+data.top);
		socket.broadcast.emit('otherMovement', data);
	})
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
