function Game(width, height, socket) {
    this.tiles = [];
    this.players = [];
    
    this.finished = false;
    this.finisher = "";
    
    this.socket = socket;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    
    var t = this;
    setInterval(function(){ t.update(); }, 30);
}

Game.prototype = {

    update: function () {
        this.clear();
        this.players.forEach(p => {
            if (p.isLocal) {
                var camX = (-p.x + this.canvas.width/2).clamp(-624, 400 - this.canvas.width);
                var camY = (-p.y + this.canvas.height/2).clamp(-784, 240 - this.canvas.height);
                this.context.translate( camX, camY );

                this.tiles.forEach(t => {
                    if (p.collisionWithTile(t) && t.type != 0) {
                        p.reset();
                    }
                    t.draw();
                });
                this.socket.emit('sync', { id: p.id, name: p.name, x: p.x, y: p.y, hframeIndex: p.hframeIndex, vframeIndex: p.vframeIndex, hframeOffset: p.hframeOffset, vframeOffset: p.vframeOffset, lastMessage: p.lastMessage  });

                // draw message
                if (this.finished) {
                    this.context.textAlign = "center";
                    this.context.font = "10px Sans-serif"
                    this.context.strokeStyle = 'black';
                    this.context.lineWidth = 2.5;
                    this.context.strokeText(`${this.finisher} has escaped the labyrinth`, p.x, 120);
                    this.context.fillStyle = 'white';
                    this.context.fillText(`${this.finisher} has escaped the labyrinth`, p.x, 120);
                }
            }
            p.update();
        });
    },

    clear: function () {
        this.context.setTransform(1,0,0,1,0,0);
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