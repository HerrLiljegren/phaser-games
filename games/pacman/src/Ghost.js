'use strict';
var Ghost = function(game) {
    this.game = game;

    this.sprite = this.game.add.sprite(32 * 13, 32 * 11, 'sprites');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.frame = 0;

    this.sprite.animations.add('right', [0, 1], 4, true);
    this.sprite.animations.add('down', [14, 15], 4, true);
    this.sprite.animations.add('left', [28, 29], 4, true);
    this.sprite.animations.add('up', [32, 33], 4, true);
    
    this.maxSpeed = 150;

    this.sprite.body.velocity.x = this.maxSpeed;
    this.sprite.animations.play('right');
}

Ghost.prototype.update = function() {
    
}