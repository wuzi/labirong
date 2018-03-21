const path = require('path');
const express = require('express');
const config = require('./config');
const app = express();
const server = require('http').createServer(app).listen(config.port);
const io = require('socket.io').listen(server);
const map = require('./map');

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});
app.use(express.static(path.resolve(__dirname + '/../client')));

console.log(`Server started at http://localhost:${server.address().port}`);

//-----------------------------------------------------------------------------

function Game(params) {
	this.tiles = [];
	this.players = [];
}

Game.prototype = {
	addPlayer: function (player) {
		this.players.push(player);
	},

	removePlayer: function (id) {
		this.players = this.players.filter(function (p) { return p.id != id });
	},
}

var game = new Game();
game.tiles = map.generate();

//-----------------------------------------------------------------------------

io.on('connection', function (client) {
	client.emit('connection');
	console.log('New player connected');

	client.on('join', function (player) {
		console.log(`${player.name} joined the game`)

		client.emit('addPlayer', { id: client.id, name: player.name, color: player.color, isLocal: true, x: 512, y: 18 });
		game.players.forEach(p => { client.emit('addPlayer', { id: p.id, name: p.name, color: p.color, isLocal: false, x: p.x, y: p.y }); });

		client.broadcast.emit('addPlayer', { id: client.id, name: player.name, color: player.color, isLocal: false, x: 512, y: 18 });

		game.addPlayer({ id: client.id, name: player.name, color: player.color, x: 512, y: 18 });

		client.emit('updateMap', game.tiles);
	});

	client.on('disconnect', function () {
		var player = game.players.find(x => x.id === client.id);

		if (player)
			console.log(`${player.name} has left the game`);
		else
			console.log(`A player disconnected`);

		game.removePlayer(client.id);
		client.broadcast.emit('removePlayer', { id: client.id });
	});

	client.on('sync', function (player) {
		game.players.forEach(p => {
			if (p.id == player.id) {
				p.x = player.x;
				p.y = player.y;
			}
		});
		client.broadcast.emit('sync', game.players);
	});
});

