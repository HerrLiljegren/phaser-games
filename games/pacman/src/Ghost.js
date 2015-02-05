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
            break;

        case 1:
            this._addYellowAnimations();
            this.homePosition = new Phaser.Point(21 * 32, 1 * 32);
            this.startPosition = new Phaser.Point(32 * 14, 32 * 13);
            break;

        case 2:
            this._addPinkAnimations();
            this.homePosition = new Phaser.Point(8 * 32, 29 * 32);
            this.startPosition = new Phaser.Point(32 * 13, 32 * 14);
            break;

        case 3:
            this._addBlueAnimations();
            this.homePosition = new Phaser.Point(19 * 32, 29 * 32);
            this.startPosition = new Phaser.Point(32 * 14, 32 * 14);
            break;
    }
    
    this.sprite.reset(this.startPosition.x, this.startPosition.y);
    this.tweenDirection = new Phaser.Point(this.startPosition.x, this.startPosition.y);
    
    


    this.tileSpeed = 250;
    this.direction = Phaser.RIGHT;
    this.tweenDirection;
    this.moving = false;
    //this.sprite.body.velocity.y = -this.maxSpeed;
    //this.sprite.animations.play('right');
}

Pacman.Ghost.prototype.update = function() {

    if (!this.moving) {

        //var tweenDirection = this._getTweenDirection(this.sprite, this.direction)
        this.game.add.tween(this.sprite)
            .to(this.tweenDirection, this.tileSpeed, Phaser.Easing.Linear.None, true)
            .onComplete.add(function() {
                this.moving = false;


                var tile = new Phaser.Point(this.sprite.x / 32, this.sprite.y / 32);
                var surroundingTiles = Pacman.Helpers.Tilemap.getSurroundingTiles(this.tilemap.map, tile.x, tile.y, this.tilemap.level);

                var validDirections = {
                    canMoveUp: this.direction !== Phaser.DOWN && this.tilemap.passableTiles.indexOf(surroundingTiles.up.index) > -1,
                    canMoveDown: this.direction !== Phaser.UP && this.tilemap.passableTiles.indexOf(surroundingTiles.down.index) > -1,
                    canMoveLeft: this.direction !== Phaser.RIGHT && this.tilemap.passableTiles.indexOf(surroundingTiles.left.index) > -1,
                    canMoveRight: this.direction !== Phaser.LEFT && this.tilemap.passableTiles.indexOf(surroundingTiles.right.index) > -1
                }

                var validTiles = []
                if (validDirections.canMoveUp) {
                    validTiles.push({
                        tile: surroundingTiles.up,
                        direction: Phaser.UP
                    });
                }
                if (validDirections.canMoveDown) {
                    validTiles.push({
                        tile: surroundingTiles.down,
                        direction: Phaser.DOWN
                    });
                }
                if (validDirections.canMoveLeft) {
                    validTiles.push({
                        tile: surroundingTiles.left,
                        direction: Phaser.LEFT
                    });
                }
                if (validDirections.canMoveRight) {
                    validTiles.push({
                        tile: surroundingTiles.right,
                        direction: Phaser.RIGHT
                    });
                }



                if (validTiles.length > 0) {
                    this.tweenDirection = this._calculateDirection(validTiles, this.player);
                }
                else {
                    this.tweenDirection = {
                        x: this.sprite.x,
                        y: this.sprite.y - 32
                    };
                    this.direction = Phaser.UP;
                }

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


            }, this);

        this.moving = true;
    }
};

Pacman.Ghost.prototype.render = function() {
    //this.game.debug.body(this.sprite);

    this.game.debug.spriteInfo(this.sprite, 32 * 28, 32);
};

Pacman.Ghost.prototype._calculateDirection = function(validTiles, player) {

    //var target = player.sprite.position;
    //var target = new Phaser.Point(23*30, 1*32);
    var target = this.homePosition;

    var dist = 99999; // egentligen: widht + height
    var idx = -1;
    for (var i = 0, l = validTiles.length; i < l; i++) {
        var newDist = Math.abs(validTiles[i].tile.worldX - target.x) + Math.abs(validTiles[i].tile.worldY - target.y);

        if (newDist > dist)
            continue;
        dist = newDist;
        idx = i;
    }

    this.direction = validTiles[idx].direction;
    return {
        x: validTiles[idx].tile.worldX,
        y: validTiles[idx].tile.worldY
    }
    // inte riktigt med på vad du menar :( vet vbara vilket håll jag får gå

    //Phaser.Point.distance(new Phaser.Point(0, 0), new Phaser.Point(10, 10))

    // ogogogog fastre!!!1!! Vad tror du om att istället för att skicka in validDirections skicka in dom tile-indexarna han kan gå till?
    // Sen kan du kolla alla tiles och se vilken som är närmast spelaren. :)
    debugger;
};

Pacman.Ghost.prototype._getTweenDirection = function(sprite, direction) {
    var x, y;

    switch (direction) {
        case Phaser.UP:
            x = sprite.x;
            y = sprite.y - 32;
            break;

        case Phaser.DOWN:
            x = sprite.x;
            y = sprite.y + 32;
            break;

        case Phaser.LEFT:
            x = sprite.x - 32;
            y = sprite.y;
            break;

        case Phaser.RIGHT:
            x = sprite.x + 32;
            y = sprite.y;
            break;
    }

    return {
        x: x,
        y: y
    }
}

Pacman.Ghost.prototype.wallCollision = function(ghost, wall) {
    return;

    if (ghost.body.touching.left) {
        // ghost is touching the wall to its left
    }
    if (ghost.body.touching.right) {
        // ghost is touching the wall to its right
    }
    if (ghost.body.touching.up) {
        ghost.body.velocity.set(this.maxSpeed, 0);
    }
    if (ghost.body.touching.down) {
        // ghost is touching the wall below
    }
}


Pacman.Ghost.prototype._addRedAnimations = function() {
    this.sprite.animations.add('right', [0, 1], 4, true);
    this.sprite.animations.add('down', [14, 15], 4, true);
    this.sprite.animations.add('left', [28, 29], 4, true);
    this.sprite.animations.add('up', [42, 43], 4, true);
}

Pacman.Ghost.prototype._addYellowAnimations = function() {
    this.sprite.animations.add('right', [2, 3], 4, true);
    this.sprite.animations.add('down', [16, 17], 4, true);
    this.sprite.animations.add('left', [30, 31], 4, true);
    this.sprite.animations.add('up', [44, 45], 4, true);
}

Pacman.Ghost.prototype._addPinkAnimations = function() {
    this.sprite.animations.add('right', [4, 5], 4, true);
    this.sprite.animations.add('down', [18, 19], 4, true);
    this.sprite.animations.add('left', [32, 33], 4, true);
    this.sprite.animations.add('up', [46, 47], 4, true);
}

Pacman.Ghost.prototype._addBlueAnimations = function() {
    this.sprite.animations.add('right', [6, 7], 4, true);
    this.sprite.animations.add('down', [20, 21], 4, true);
    this.sprite.animations.add('left', [34, 35], 4, true);
    this.sprite.animations.add('up', [48, 49], 4, true);
}

Pacman.Ghost.prototype.setTilemap = function(tilemap) {
    this.tilemap = tilemap;
}

Pacman.Ghost.prototype.route = function(sprite, tile) {
    debugger;
}