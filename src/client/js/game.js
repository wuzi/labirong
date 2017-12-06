function Game(width, height, socket) {
    this.tiles = [];
    this.players = [];
    
    this.socket = socket;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    
    var t = this;
    setInterval(function(){ t.update(); }, 20);
}

Game.prototype = {

    update: function () {        
        this.clear();        
        
        this.players.forEach(p => {
            if (p.isLocal)
            {
                this.tiles.forEach(t => {
                    if (p.collisionWithTile(t) && t.type == 48) {
                        p.reset();
                    }
                    t.draw();
                });
                this.socket.emit('sync', {id: p.id, name: p.name, x: p.x, y: p.y});
            }
            p.update();
        });        
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    addPlayer: function(id, name, x, y, color, isLocal) {
        var player = new Player(id, name, x, y, color, 12, 12, isLocal, this.context);
        this.players.push(player);
    },

    removePlayer: function(id) {
        this.players = this.players.filter(function(p) { return p.id != id });
    },

    addTile: function(tile) {
        var tile = new Tile(tile.x, tile.y, tile.type, 16, 16, this.context);
        this.tiles.push(tile);
    },

    clearTiles: function() {
        this.tiles = [];
    }
}