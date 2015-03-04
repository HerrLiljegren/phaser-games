/* global Machine: true, Phaser: true */
'use strict';
Machine.Enemy = function(game, player) {
    Phaser.Sprite.call(this, game, 0, 0, 'soldier');
    
    this.player = player;
};