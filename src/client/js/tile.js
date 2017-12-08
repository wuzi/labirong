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
                this.$context.drawImage(ASSET_MANAGER.getAsset('image/stones.png'), this.x, this.y, this.width, this.height);
                break;
            default:
                this.$context.drawImage(ASSET_MANAGER.getAsset('image/grass.png'), this.x, this.y, this.width, this.height);
                break;
        }        
    }
}