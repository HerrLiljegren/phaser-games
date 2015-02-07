'use strict';
Pacman.Ghost = function(game, player, index) {
    this.game = game;
    this.player = player;
    this.tilemap = null;

    this.sprite = this.game.add.sprite(32 * 11, 32 * 11, 'sprites');
    this.sprite.name = "ghost";
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.frame = 0;

    this.sprite.animations.add('weak', [12, 13], 4, true);

    switch (index) {
        case 0:
            this._addRedAnimations();
            this.homePosition = new Phaser.Point(6 * 32, 1 * 32);
            this.startPosition = new Phaser.Point(32 * 9, 32 * 11);
            this.name = "Red";
            break;

        case 1:
            this._addYellowAnimations();
            this.homePosition = new Phaser.Point(21 * 32, 1 * 32);
            this.startPosition = new Phaser.Point(32 * 14, 32 * 13);
            this.name = "Yellow";
            break;

        case 2:
            this._addPinkAnimations();
            this.homePosition = new Phaser.Point(8 * 32, 29 * 32);
            this.startPosition = new Phaser.Point(32 * 13, 32 * 14);
            this.name = "Pinky";
            break;

        case 3:
            this._addBlueAnimations();
            this.homePosition = new Phaser.Point(19 * 32, 29 * 32);
            this.startPosition = new Phaser.Point(32 * 14, 32 * 14);
            this.name = "Blue";
            break;
    }

    this.sprite.reset(this.startPosition.x, this.startPosition.y);
    this.tweenDirection = new Phaser.Point(this.startPosition.x, this.startPosition.y);
    this.targetPosition = this.homePosition;




    
    this.direction = Phaser.RIGHT;
    this.tweenDirection;
    this.moving = false;
    //this.sprite.body.velocity.y = -this.maxSpeed;
    //this.sprite.animations.play('right');
}

Pacman.Ghost.prototype.update = function() {

    //this.targetPosition = this.player.sprite.position;
    if (!this.moving) {

        this.game.add.tween(this.sprite)
            .to(this.tweenDirection, Pacman.Ghost.Behaviour[this.name].maxSpeed, Phaser.Easing.Linear.None, true)
            .onComplete.add(this._calculateMovement, this);


        if (this.player.isSuper) {
            this.sprite.animations.play('weak');
        }
        else {
            switch (this.direction) {
                case Phaser.UP:
                    this.sprite.animations.play('up');
                    break;
                case Phaser.DOWN:
                    this.sprite.animations.play('down');
                    break;
                case Phaser.LEFT:
                    this.sprite.animations.play('left');
                    break;
                case Phaser.RIGHT:
                    this.sprite.animations.play('right');
                    break;
            }
        }

        var canISeeYou = this.isPlayerVisible(this.player.sprite);
        if (canISeeYou) {
            console.log(this.name, "sees player");
            this.targetPosition = this.player.sprite.position;
        }
        else {
            this.targetPosition = this.homePosition;
        }
        this.moving = true;
    }
};

Pacman.Ghost.prototype.render = function() {
    //this.game.debug.body(this.sprite);

    this.game.debug.spriteInfo(this.sprite, 32 * 28, 32);


    var c = new Phaser.Circle(this.sprite.body.center.x, this.sprite.body.center.y, Pacman.Ghost.Behaviour[this.name].viewDistance);
    this.game.debug.geom(c);
};

Pacman.Ghost.prototype.isPlayerVisible = function(player) {
    var distance = Phaser.Math.distance(this.sprite.body.center.x, this.sprite.body.center.y, player.body.center.x, player.body.center.y);
    return distance < 300;
};

Pacman.Ghost.prototype._calculateMovement = function() {
    this.moving = false;


    var tile = new Phaser.Point(this.sprite.x / 32, this.sprite.y / 32);
    var surroundingTiles = Pacman.Helpers.Tilemap.getSurroundingTiles(this.tilemap.level, tile.x, tile.y);
    var validDirections = Pacman.Helpers.Tilemap.getValidDirections(this.direction, this.tilemap.passableTiles, surroundingTiles);
    var validTiles = Pacman.Helpers.Tilemap.getValidTilesToMoveTo(validDirections, surroundingTiles);

    if (validTiles) {
        this.tweenDirection = Pacman.Ghost.Behaviour[this.name].calculateDirection(validTiles, this.targetPosition);
        this.direction = this.tweenDirection.direction;
    }
    else if (this.sprite.x === 0 && this.direction === Phaser.LEFT) {
        this.tweenDirection = {
            x: this.sprite.x - 32,
            y: this.sprite.y
        };
    }
    else if (this.sprite.x < 0) {
        this.sprite.x = 864 + 32;

        this.tweenDirection = {
            x: this.sprite.x = 864,
            y: this.sprite.y
        };
        this.direction = Phaser.LEFT;
    }
    else if (this.sprite.x === 864 && this.direction === Phaser.RIGHT) {
        this.tweenDirection = {
            x: this.sprite.x + 32,
            y: this.sprite.y
        };
    }
    else if (this.sprite.x > 864) {
        this.sprite.x = -32;
        this.tweenDirection = {
            x: this.sprite.x = 0,
            y: this.sprite.y
        };
        this.direction = Phaser.RIGHT;
    }
    else {
        this.tweenDirection = {
            x: this.sprite.x,
            y: this.sprite.y - 32
        };
        this.direction = Phaser.UP;
    }
};

Pacman.Ghost.Behaviour = {
    "Red": {
        maxSpeed: 250,
        viewDistance: 600,
        calculateDirection: _calculateDirection
    },
    "Blue": {
        maxSpeed: 250,
        viewDistance: 300,
        calculateDirection: function(validTiles, target) {
            var dist = 0; // egentligen: widht + height
            var idx = -1;
            for (var i = 0, l = validTiles.length; i < l; i++) {
                var newDist = Math.abs(validTiles[i].tile.worldX - target.x) + Math.abs(validTiles[i].tile.worldY - target.y);

                if (newDist < dist)
                    continue;
                dist = newDist;
                idx = i;
            }


            return {
                direction: validTiles[idx].direction,
                x: validTiles[idx].tile.worldX,
                y: validTiles[idx].tile.worldY
            }
        }
    },
    "Yellow": {
        maxSpeed: 250,
        viewDistance: 300,
        calculateDirection: _calculateDirection
    },
    "Pinky": {
        maxSpeed: 250,
        viewDistance: 300,
        calculateDirection: _calculateDirection
    }
}

function _calculateDirection(validTiles, target) {

    //var target = player.sprite.position;
    //var target = new Phaser.Point(23*30, 1*32);

    var dist = 999990; // egentligen: widht + height
    var idx = -1;
    for (var i = 0, l = validTiles.length; i < l; i++) {
        var newDist = Math.abs(validTiles[i].tile.worldX - target.x) + Math.abs(validTiles[i].tile.worldY - target.y);

        if (newDist > dist)
            continue;
        dist = newDist;
        idx = i;
    }


    return {
        direction: validTiles[idx].direction,
        x: validTiles[idx].tile.worldX,
        y: validTiles[idx].tile.worldY
    }
    // inte riktigt med på vad du menar :( vet vbara vilket håll jag får gå

    //Phaser.Point.distance(new Phaser.Point(0, 0), new Phaser.Point(10, 10))

    // ogogogog fastre!!!1!! Vad tror du om att istället för att skicka in validDirections skicka in dom tile-indexarna han kan gå till?
    // Sen kan du kolla alla tiles och se vilken som är närmast spelaren. :)
};


Pacman.Ghost.prototype._addRedAnimations = function() {
    this.sprite.animations.add('right', [0, 1], 4, true);
    this.sprite.animations.add('down', [14, 15], 4, true);
    this.sprite.animations.add('left', [28, 29], 4, true);
    this.sprite.animations.add('up', [42, 43], 4, true);
};

Pacman.Ghost.prototype._addYellowAnimations = function() {
    this.sprite.animations.add('right', [2, 3], 4, true);
    this.sprite.animations.add('down', [16, 17], 4, true);
    this.sprite.animations.add('left', [30, 31], 4, true);
    this.sprite.animations.add('up', [44, 45], 4, true);
};

Pacman.Ghost.prototype._addPinkAnimations = function() {
    this.sprite.animations.add('right', [4, 5], 4, true);
    this.sprite.animations.add('down', [18, 19], 4, true);
    this.sprite.animations.add('left', [32, 33], 4, true);
    this.sprite.animations.add('up', [46, 47], 4, true);
};

Pacman.Ghost.prototype._addBlueAnimations = function() {
    this.sprite.animations.add('right', [6, 7], 4, true);
    this.sprite.animations.add('down', [20, 21], 4, true);
    this.sprite.animations.add('left', [34, 35], 4, true);
    this.sprite.animations.add('up', [48, 49], 4, true);
};

Pacman.Ghost.prototype.setTilemap = function(tilemap) {
    this.tilemap = tilemap;
};
