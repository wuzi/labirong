var game = null;
var socket = io.connect('/');

// Assets
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('image/stones.png');
ASSET_MANAGER.queueDownload('image/grass.png');

// Thanks to Curt - cjc83486 for this placeholder sprite
ASSET_MANAGER.queueDownload('image/character_red.png');
ASSET_MANAGER.queueDownload('image/character_blue.png');
ASSET_MANAGER.queueDownload('image/character_green.png');
ASSET_MANAGER.queueDownload('image/character_yellow.png');

ASSET_MANAGER.downloadAll(function () {
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

                player.hframeIndex = serverPlayer.hframeIndex;
				player.vframeIndex = serverPlayer.vframeIndex;
				
				player.hframeOffset = serverPlayer.hframeOffset;
				player.vframeOffset = serverPlayer.vframeOffset;
            }
        });
    });
});

socket.on('updateMap', function (grid) {
    if (game == null) return;

    // These settings should come from the server
    var SIZE_X = 63;
    var SIZE_Y = 34;

    for (var y = 0; y < SIZE_Y; y++) {
        for (var x = 0; x < SIZE_X; x++) {
            game.addTile({ x: x * 16, y: y * 16, type: grid[x + y * SIZE_X] });
        }
    }
});

var joinGame = function (name, color) {
    game = new Game(400, 240, socket);

    var mainMenu = document.getElementById('mainmenu');
    mainMenu.parentNode.removeChild(mainMenu);

    socket.emit('join', { name: name, color: color });
}