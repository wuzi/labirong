var path = require('path');
const config = require('./config');
const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(config.port);
const io = require('socket.io').listen(server);

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});
app.use(express.static(path.resolve(__dirname + '/../client')));

console.log(`Server started at http://localhost:${server.address().port}`);

//-----------------------------------------------------------------------------

function Game(params) {
	this.players = [];
}

Game.prototype = {
	addPlayer: function(player) {
		this.players.push(player);
	},

	removePlayer: function(id) {
		this.players = this.players.filter(function(p) { return p.id != id });
	}
}

var game = new Game();

//-----------------------------------------------------------------------------

io.on('connection', function(client) {
	client.emit('connection');
	console.log('New player connected');

	client.on('join', function(player) {
		console.log(`${player.name} joined the game`)
		
		client.emit('addPlayer', {id: client.id, name: player.name, isLocal: true, x: 40, y: 40});
		game.players.forEach(p => {client.emit('addPlayer', {id: p.id, name: p.name, isLocal: false, x: p.x, y: p.y}); });
		
		client.broadcast.emit('addPlayer', {id: client.id, name: player.name, isLocal: false, x: 40, y: 40});

		game.addPlayer({id: client.id, name: player.name, x: 40, y: 40});
	});

	client.on('disconnect', function() {
		var player = game.players.find(x => x.id === client.id);
		
		if (player)
			console.log(`${player.name} has left the game`);
		
		game.removePlayer(client.id);
		client.broadcast.emit('removePlayer', {id: client.id});		
	});

	client.on('sync', function(player) {
		game.players.forEach(p => {
			if (p.id == player.id) {
				p.x = player.x;
				p.y = player.y;
			}
		});
		client.broadcast.emit('sync', game.players);
	});
});

