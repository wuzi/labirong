var grass = new Image();
grass.src = '/image/grass.jpeg';

var block = new Image();
block.src = '/image/block.jpeg';

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
            case 48:
                this.$context.drawImage(block, this.x, this.y, this.width, this.height);
                break;
            default:
                this.$context.drawImage(grass, this.x, this.y, this.width, this.height);
                break;
        }        
    }
}