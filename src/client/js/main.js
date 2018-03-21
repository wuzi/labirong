var game = null;
var socket = io.connect('/');

// Assets
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('image/stones.png');
ASSET_MANAGER.queueDownload('image/grass.png');
ASSET_MANAGER.queueDownload('image/character.png'); // Thanks to Curt - cjc83486 for this placeholder sprite

ASSET_MANAGER.downloadAll(function() {
    document.getElementById('playBtn').style.display = 'block';
    document.getElementById('myProgress').style.display = 'none';
});

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
    game = new Game(400, 240, socket);
    
    var mainMenu = document.getElementById('mainmenu');
    mainMenu.parentNode.removeChild(mainMenu);
    
    socket.emit('join', {name: name, color: color});
}