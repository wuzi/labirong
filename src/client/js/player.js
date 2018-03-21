function Player(id, name, x, y, color, width, height, isLocal, $context) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.isLocal = isLocal;
    this.$context = $context;

    this.hframeIndex = 0;
    this.hframeOffset = 46;
    this.htotalFrames = 3;
    
    this.vframeIndex = 0;
    this.vframeOffset = 36;
    
    this.tickCount = 0;
    this.ticksPerFrame = 10;

    this.moving = {
		up: false,
		down: false,
		left: false,
        right: false,
        boost: false
    };

    if (isLocal) this.setControls();
}

Player.prototype = {

    update: function () {
        // Animate character sprite if the character is moving
        if (this.moving.up || this.moving.down || this.moving.left || this.moving.right) {
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.hframeIndex++;
                if (this.hframeIndex >= this.htotalFrames)
                    this.hframeIndex = 0;
                this.tickCount = 0;
            }

            if (this.moving.boost) this.ticksPerFrame = 5;
            else this.ticksPerFrame = 10;
        }

        this.draw();
        if (this.isLocal) this.move();
    },

    draw: function () {
        this.$context.textAlign = "center";
        this.$context.font = "10px Sans-serif"
        this.$context.strokeStyle = 'black';
        this.$context.lineWidth = 2.5;
        this.$context.strokeText(this.name, this.x + 6, this.y - 2);
        this.$context.fillStyle = 'white';
        this.$context.fillText(this.name, this.x + 6, this.y - 2);
        this.$context.drawImage(ASSET_MANAGER.getAsset(`image/character_${this.color}.png`), this.hframeIndex * this.hframeOffset, this.vframeIndex * this.vframeOffset, 37, 37, this.x, this.y, this.width, this.height);
    },

    move: function () {
        var speedX = 0;
        var speedY = 0;
            
        if (this.moving.up) {
            speedY = -1;
            this.vframeIndex = 2;
        }
        else if (this.moving.down) {
            speedY = 1;
            this.vframeIndex = 0;
        }
        if (this.moving.left) {
            speedX = -1;
            this.vframeIndex = 3;
        }
        else if (this.moving.right) {
            speedX = 1;
            this.vframeIndex = 1;
        }
        
        this.x += (this.moving.boost) ? speedX * 3 : speedX;
        this.y += (this.moving.boost) ? speedY * 3 : speedY;
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
                case 16:
                    t.moving.boost = true;
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
                case 16:
                    t.moving.boost = false;
                    break;
            }
        }
    },

    collisionWithTile: function(tile) {
        if (this.x < tile.x + tile.width &&
            this.x + this.width > tile.x &&
            this.y < tile.y + tile.height &&
            this.height + this.y > tile.y) {
            return true;
        }
        return false;
    },

    reset: function() {
        this.x = 500;
        this.y = 16;
    }
}