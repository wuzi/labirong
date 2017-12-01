function Game(width, height, socket) {
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
            p.update();
        });
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    addPlayer: function(name, x, y, color, isLocal) {
        var player = new Player(name, x, y, color, 40, 40, isLocal, this.context);
        this.players.push(player);        
    }
}