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
            case 49:
                this.$context.fillStyle = "green";
                break;
            default:
                this.$context.fillStyle = "purple";
        }
        this.$context.fillRect(this.x, this.y, this.width, this.height);
    }
}