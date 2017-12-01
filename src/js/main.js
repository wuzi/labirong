var socket = io.connect('/');
var game = new Game(1000, 540, socket);
var username = null;

socket.on('addPlayer', function (player) {
	game.addPlayer(player.name, player.x, player.y, "blue", player.isLocal);
});

socket.on('removePlayer', function (player) {
	game.removePlayer(player.name);
});

socket.on('sync', function (players) {
	game.players.forEach(player => {
        players.forEach(serverPlayer => {
            if (player.name == serverPlayer.name) {
                player.x = serverPlayer.x;
                player.y = serverPlayer.y;
            }
        });
    });
});

window.onload = function () {
    username = null;    
    while (username == null || username == "")
        username = prompt("Please enter your name:");

    socket.emit('join', {name: username});
}

window.onbeforeunload = function () {
    socket.emit('leave', {name: username});    
};