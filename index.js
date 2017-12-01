const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(7777);
const io = require('socket.io').listen(server);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/src/index.html');
});
app.use(express.static(__dirname + '/src'));

console.log(`Server started at http://localhost:${server.address().port}`);

//-----------------------------------------------------------------------------

function Game(params) {
	this.players = [];
}

Game.prototype = {
	addPlayer: function(player) {
		this.players.push(player);
	},

	removePlayer: function(playerName) {
		this.players = this.players.filter(player => this.players.name != playerName);
	}
}

var game = new Game();

//-----------------------------------------------------------------------------

io.on('connection', function(client) {
	console.log('New player connected');

	client.on('join', function(player) {
		console.log(`${player.name} joined the game`)
		
		client.emit('addPlayer', {name: player.name, isLocal: true, x: 40, y: 40});
		client.broadcast.emit('addPlayer', {name: player.name, isLocal: false, x: 40, y: 40});

		game.addPlayer({name: player.name, x: 40, y: 40});
	});

	client.on('leave', function(player) {
		console.log(`${player.name} has left the game`);
		game.removePlayer(player.name);
	});
});

