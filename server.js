var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('login', function(data) {
	console.log('a user logon');
	socket.myName = data.name;
	users.push(socket.myName);
	io.emit('logon message', socket.myName+" logon!");
  });
  
  socket.on('logon message', function(msg){
    console.log('message: ' + msg);
    io.emit('logon message', msg);
  });
  
  socket.on('new message', function(data){
    console.log('message: ' + data.message);
    io.emit('new message', data);
  });
  
  socket.on('disconnect', function(data){
    console.log(socket.myName + ' disconnected');
	socket.broadcast.emit('disconnect message', socket.myName + ' disconnected');
  });
  
  socket.on("typing", function(data) {  
		socket.broadcast.emit("isTyping", {isTyping: data, userTyping: socket.myName});
  });
});


		
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});