function Player(name, x, y, color, width, height, isLocal, $context) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.isLocal = isLocal;
    this.$context = $context;

    this.moving = {
		up: false,
		down: false,
		left: false,
		right: false
    };

    if (isLocal) this.setControls();
}

Player.prototype = {

    update: function () {
        this.draw();
        if (this.isLocal) this.move();
    },

    draw: function () {
        this.$context.fillStyle = this.color;
        this.$context.font = "15px Arial";
        this.$context.textAlign = "center";
        this.$context.strokeText(this.name, this.x + 18, this.y - 1);
        this.$context.fillRect(this.x, this.y, this.width, this.height);
    },

    move: function () {
        var speedX = 0;
        var speedY = 0;
            
        if (this.moving.up)
            speedY = -1;
        if (this.moving.down)
            speedY = 1;
        if (this.moving.left)
            speedX = -1;
        if (this.moving.right)
            speedX = 1;
        
        this.x += speedX;
        this.y += speedY;
    },

    setControls: function () {
        var t = this;
        document.onkeydown = function(e) {
            var key = e.keyCode || e.which;
            switch (key) {
                case 38:
                case 87:
                    t.moving.up = true;
                    break;
                case 37:
                case 65:
                    t.moving.left = true;
                    break;
                case 40:
                case 83:
                    t.moving.down = true;
                    break;
                case 39:
                case 68:
                    t.moving.right = true;
                    break;
            }
        }

        document.onkeyup = function(e) {
            var key = e.keyCode || e.which;
            switch (key) {
                case 38:
                case 87:
                    t.moving.up = false;
                    break;
                case 37:
                case 65:
                    t.moving.left = false;
                    break;
                case 40:
                case 83:
                    t.moving.down = false;
                    break;
                case 39:
                case 68:
                    t.moving.right = false;
                    break;
            }
        }
    }
}