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
	this.finished = false;
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
game.tiles = map.generate(config.SIZE_X, config.SIZE_Y);

//-----------------------------------------------------------------------------

io.on('connection', function (client) {
	client.emit('connection');
	console.log('New player connected');

	client.on('join', function (player) {
		console.log(`${player.name} joined the game`)

		client.emit('addPlayer', { id: client.id, name: player.name, color: player.color, isLocal: true, x: 515, y: 16 });
		game.players.forEach(p => { client.emit('addPlayer', { id: p.id, name: p.name, color: p.color, isLocal: false, x: p.x, y: p.y }); });

		client.broadcast.emit('addPlayer', { id: client.id, name: player.name, color: player.color, isLocal: false, x: 515, y: 16 });

		game.addPlayer({ id: client.id, name: player.name, color: player.color, x: 515, y: 16 });

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
				
				p.hframeIndex = player.hframeIndex;
				p.vframeIndex = player.vframeIndex;
				
				p.hframeOffset = player.hframeOffset;
				p.vframeOffset = player.vframeOffset;

				p.lastMessage = player.lastMessage;

				// check if the player has escaped
				if (p.y > config.SIZE_Y * 16 && !game.finished) {
					game.finished = true;
					io.sockets.emit('finishMap', player);

					setTimeout(function () {
						game.finished = false;
						game.tiles = map.generate(config.SIZE_X, config.SIZE_Y);
						io.sockets.emit('updateMap', game.tiles);
					}, 5000);
				}
			}
		});
		client.broadcast.emit('sync', game.players);
	});
});

