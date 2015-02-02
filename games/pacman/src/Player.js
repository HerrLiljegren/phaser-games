'use strict';
var Player = function(game) {
    this.game = game;
    this.startX = 32 * 13;
    this.startY = 32 * 17;
    this.sprite = this.game.add.sprite(this.startX, this.startY, 'sprites');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.frame = 10;

    this.sprite.animations.add('right', [10, 11], 4, true);
    this.sprite.animations.add('down', [24, 25], 4, true);
    this.sprite.animations.add('left', [38, 39], 4, true);
    this.sprite.animations.add('up', [52, 53], 4, true);

    this.maxSpeed = 150;

    this.sprite.body.velocity.x = this.maxSpeed;
    this.sprite.animations.play('right');

}

Player.prototype.update = function () {
    if (this.game.gameOver) return;
    if (movementKeys.left.isDown) {
        this.sprite.body.velocity.x = -this.maxSpeed;
        player.sprite.animations.play('left');
    }
    else if (movementKeys.right.isDown) {
        this.sprite.body.velocity.x = this.maxSpeed;
        player.sprite.animations.play('right');
    }
    
    if (movementKeys.up.isDown) {
        this.sprite.body.velocity.y = -this.maxSpeed;
        player.sprite.animations.play('up');
    }
    else if (movementKeys.down.isDown) {
        this.sprite.body.velocity.y = this.maxSpeed;
        player.sprite.animations.play('down');
    }
    
    if (!movementKeys.left.isDown && !movementKeys.right.isDown && !movementKeys.up.isDown && !movementKeys.down.isDown) {
        //  Stand still
        //player.sprite.animations.stop();
        //player.frame = 4;
    }
}

Player.prototype.die = function(a, b, c) {
    
    if (!this.game.gameOver && --this.game.lives < 1) {
        this.game.gameOver = true;
    } else {
        this.sprite.position.set(this.startX, this.startY);
    };
}
