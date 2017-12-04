function Tile(x, y, width, height, $context) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.$context = $context;
}

Tile.prototype = {

    draw: function () {
        this.$context.fillStyle = "green";
        this.$context.fillRect(this.x, this.y, this.width, this.height);
    }
}