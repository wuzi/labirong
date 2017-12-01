var socket = io.connect('/');
var game = new Game(1000, 540, socket);
var username = null;

socket.on('addPlayer', function (player) {
	game.addPlayer(player.name, player.x, player.y, "blue", player.isLocal);
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