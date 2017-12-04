var socket = io.connect('/');
var game = new Game(1000, 540, socket);

socket.on('connection', function (player) {
	var username = null;    
    while (username == null || username == "")
        username = prompt("Please enter your name:");

    socket.emit('join', {name: username});
});

socket.on('disconnect', function () {
	game.players.forEach(player => {
        game.removePlayer(player.id);
    });
});

socket.on('addPlayer', function (player) {
	game.addPlayer(player.id, player.name, player.x, player.y, "blue", player.isLocal);
});

socket.on('removePlayer', function (player) {
	game.removePlayer(player.id);
});

socket.on('sync', function (players) {
	game.players.forEach(player => {
        players.forEach(serverPlayer => {
            if (player.id == serverPlayer.id && player.isLocal == false) {
                player.x = serverPlayer.x;
                player.y = serverPlayer.y;
            }
        });
    });
});
