var stones = new Image();
stones.src = '/image/stones.png';

var grass = new Image();
grass.src = '/image/grass.png';

function Tile(x, y, type, width, height, $context) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = width;
    this.height = height;
    this.$context = $context;
}

Tile.prototype = {

    draw: function () {        
        switch (this.type) {
            case 1:
                this.$context.drawImage(grass, this.x, this.y, this.width, this.height);
                break;
            default:
                this.$context.drawImage(stones, this.x, this.y, this.width, this.height);
                break;
        }        
    }
}