/* global Phaser:true */
'use strict';
Pacman.Tilemap = function(game, player) {
    this.game = game;
    this.player = player;
    this.game.stage.backgroundColor = '#000';
    this.map = this.game.add.tilemap('pacman-level');
    this.map.addTilesetImage('maptiles', 'maptiles');

    this.level = this.map.createLayer('Level');
    this.pills = this.map.createLayer('Pills');

    var t = this.map.objects['Metadata'];
    this.collisionRect = new Phaser.Rectangle();
    this.previousFacing = 0;
    this.speed = 32;
    this.passableTiles = [-1, 28, 29, 30];

    //this.layer2 = this.map.createLayer('Level2');

    //this.ground.scale.set(2, 2);
    //this.trees.scale.set(2, 2);
    //this.ground.resizeWorld();
    //this.trees.resizeWorld();
    ////this.layer2.resizeWorld();
    ////this.layer.debug = true;
    //this.trees.debug = true;

    //this.map.setCollisionByExclusion([170,229, 193, 194], this.layer);
    this.map.setCollisionByExclusion(this.passableTiles, true, this.level);

    this.map.setTileIndexCallback([28, 30], function(sprite, tile) {
        if (sprite.name === "ghost") {
            return;
            this.collisionRect.setTo(tile.worldX, tile.worldY, tile.width, tile.height);

            
            if (sprite.x === tile.worldX && sprite.y === tile.worldY) {
                sprite.body.velocity.x = this.speed;
            }


            var surroundingTiles = {
                up: this.map.getTileAbove(this.level.index, tile.x, tile.y),
                down: this.map.getTileBelow(this.level.index, tile.x, tile.y),
                right: this.map.getTileRight(this.level.index, tile.x, tile.y),
                left: this.map.getTileLeft(this.level.index, tile.x, tile.y)
            }

            var moveUp = false;
            var moveDown = false;
            var moveLeft = false;
            var moveRight = false;

            if (sprite.body.facing === Phaser.RIGHT) {
                if (surroundingTiles.up.index === -1 || surroundingTiles.down.index === -1) {
                    if (sprite.y === tile.worldY && sprite.x >= tile.worldX) {
                        moveUp = surroundingTiles.up.index === -1;
                        moveDown = surroundingTiles.down.index === -1;
                    }
                }
            }

            if (sprite.body.facing === Phaser.LEFT) {
                if (surroundingTiles.up.index === -1 || surroundingTiles.down.index === -1) {
                    if (sprite.y >= tile.worldY && sprite.x <= surroundingTiles.up.worldX) {
                        moveUp = surroundingTiles.up.index === -1;
                        moveDown = surroundingTiles.down.index === -1;
                    }
                }
            }
            
            if(sprite.body.facing === Phaser.UP){
                if(surroundingTiles.right.index === -1 || surroundingTiles.left.index === -1){
                    if(sprite.y >= surroundingTiles.right.worldY && sprite.x === tile.worldX){
                        moveRight = surroundingTiles.right.index === -1;
                        moveLeft = surroundingTiles.left.index === -1;
                    }
                }
            }
            
            if(sprite.body.facing === Phaser.DOWN){
                if(surroundingTiles.right.index === -1 || surroundingTiles.left.index === -1){
                    if(sprite.y <= tile.worldY && sprite.x === tile.worldX){
                        moveRight = surroundingTiles.right.index === -1;
                        moveLeft = surroundingTiles.left.index === -1;
                    }
                }
            }

            console.log("Can move up", moveUp, "Can move down", moveDown, "Can move right", moveRight, "Can move left", moveLeft);
            if (moveDown && this.previousFacing !== Phaser.DOWN) {
                sprite.x = tile.worldX;
                sprite.body.velocity.set(0, this.speed);
            } else if (moveUp && this.previousFacing !== Phaser.UP) {
                sprite.x = tile.worldX;
                sprite.body.velocity.set(0, -this.speed);
            } else if(moveLeft && this.previousFacing !== Phaser.LEFT){
                sprite.y = tile.worldY;
                sprite.body.velocity.set(-this.speed, 0);
            } else if(moveRight && this.previousFacing !== Phaser.RIGHT){
                sprite.y = tile.worldY;
                sprite.body.velocity.set(this.speed, 0);
            }



            this.previousFacing = sprite.body.facing;


            return;




            var changeDirection = false;

            if (sprite.body.facing === Phaser.UP && (sprite.body.blocked.up || !freeDirections.up)) {
                changeDirection = true;
            }
            else if (sprite.body.facing === Phaser.DOWN && (sprite.body.blocked.down || !freeDirections.down)) {
                changeDirection = true;
            }
            else if (sprite.body.facing === Phaser.RIGHT && (sprite.body.blocked.right || !freeDirections.right)) {
                changeDirection = true;
            }
            else if (sprite.body.facing === Phaser.LEFT && (sprite.body.blocked.left || !freeDirections.left)) {
                changeDirection = true;
            }

            if (sprite.body.facing === Phaser.UP && (freeDirections.left || freeDirections.right)) {
                changeDirection = true;
            }
            else if (sprite.body.facing === Phaser.DOWN && (freeDirections.left || freeDirections.right)) {
                changeDirection = true;
            }
            else if (sprite.body.facing === Phaser.RIGHT && (freeDirections.up || freeDirections.down)) {
                changeDirection = true;
            }
            else if (sprite.body.facing === Phaser.LEFT && (freeDirections.up || freeDirections.down)) {
                changeDirection = true;
            }

            if (changeDirection) {
                var direction = this.game.random.between(1, 4);

                if (direction != sprite.body.facing) {
                    switch (direction) {
                        case Phaser.UP:
                            sprite.body.velocity.set(0, -150);
                            break;
                        case Phaser.DOWN:
                            sprite.body.velocity.set(0, 150);
                            break;
                        case Phaser.RIGHT:
                            sprite.body.velocity.set(150, 0);
                            break;
                        case Phaser.LEFT:
                            sprite.body.velocity.set(-150, 0);
                            break;
                    }
                }
            }

            return;

            console.log("Tileabove: ", this.map.getTileAbove(this.level.index, tile.x, tile.y));



            if (aroundMe.above.index === -1 && sprite.y === tile.worldY && sprite.x >= tile.worldX) {
                sprite.x = tile.worldX;
                sprite.body.velocity.set(0, -100);
            }

            return;

            console.log(sprite.body.blocked)
            if (sprite.y === tile.worldY && sprite.x === tile.worldX) {

                if (!sprite.body.touching.none) {
                    console.log("touching");
                }

                if (sprite.body.velocity.x != 0) // We move horizontal
                {

                }


                sprite.body.velocity.x = 100;


                //console.log(aroundMe);
            }
        }
        else if (sprite.name === "player") {

            if (Math.abs(sprite.x - tile.worldX) < (tile.width * 0.5) && Math.abs(sprite.y - tile.worldY) < (tile.height * 0.5)) {

                if (tile.index == 28) {
                    this.player.makeSuper();
                }

                tile.index = -1;
                this.pills.dirty = true;
                this.game.score++;

                //this.game.soundEatFruit.play();
            }
        }

        return false;
    }, this, this.pills);

    //this.level.debug = true;
}

Pacman.Tilemap.prototype = {
    render: function() {
        this.game.debug.geom(this.collisionRect, 'rgba(0,255,0,0.75)');
    }
}