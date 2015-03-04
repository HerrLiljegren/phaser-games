/* global Machine: true, Phaser: true */
'use strict';

Machine.Enemy = function(game, player, startX, startY) {
    Phaser.Sprite.call(this, game, startX, startY, 'soldier');
    
    this.player = player;
    this.game.physics.arcade.enable(this);
};

Machine.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Machine.Enemy.prototype.constructor = Machine.Enemy;



Machine.Enemy.prototype.update = function() {
    //this.rotation = this.game.physics.arcade.moveToObject(this, this.player, 300);
};

Machine.Enemy.prototype.kill = function() {
    //Phaser.Sprite.prototype.kill.call(this); // Call childrens update
    
    this.alive = false;
    this.frame = 1;
};