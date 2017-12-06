var game = null;
var socket = io.connect('/');

socket.on('connection', function (player) {
	// TODO: Show login-form and stop connecting animation
});

socket.on('disconnect', function () {
    if (game == null) return;

	game.players.forEach(player => {
        game.removePlayer(player.id);
    });
    game.clearTiles();
});

socket.on('addPlayer', function (player) {
    if (game == null) return;
    
	game.addPlayer(player.id, player.name, player.x, player.y, player.color, player.isLocal);
});

socket.on('removePlayer', function (player) {
    if (game == null) return;

	game.removePlayer(player.id);
});

socket.on('sync', function (players) {
    if (game == null) return;

	game.players.forEach(player => {
        players.forEach(serverPlayer => {
            if (player.id == serverPlayer.id && player.isLocal == false) {
                player.x = serverPlayer.x;
                player.y = serverPlayer.y;
            }
        });
    });
});

socket.on('updateMap', function (tiles) {
    if (game == null) return;

    tiles.forEach(tile => {
        game.addTile({x: tile.x, y: tile.y, type: tile.type});
    });
});

var joinGame = function (name, color) {
    game = new Game(1000, 540, socket);
    document.getElementById('mainmenu').innerHTML = "";
    socket.emit('join', {name: name, color: color});
}