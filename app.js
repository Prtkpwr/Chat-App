var express = require('express');
var app		= express();
var server  = require('http').createServer(app);
var io		= require('socket.io').listen(server);
server.maxConnections = 5;
users 		= [];
connections = [];

server.listen(3000);
	console.log('Server connected to port 3000');


app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});
	//Connecting to socket.io
	io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected : %s sockets connected', connections.length);


	//Dissconnect
	socket.on('disconnect', function(data){
	//if(!socket.username) return;
	users.splice(users.indexOf(socket.username), 1);
	updateUsernames();
	connections.splice(connections.indexOf(socket),1);
	console.log('Dissconnected: %s sockets connected', connections.length);
	});

	//send msg
	socket.on('send message',function(data){
		console.log(data)
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//new  user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	function updateUsernames() {
		io.sockets.emit('get users',users);
	}

});
