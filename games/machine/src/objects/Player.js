/* global Machine: true, Phaser: true */
'use strict';

Machine.Player = function(game, startX, startY) {
    
     //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Sprite.call(this, game, startX, startY, 'full-body');
    
};

Machine.Player.prototype = Object.create(Phaser.Sprite.prototype);
Machine.Player.prototype.constructor = Machine.Player;

Machine.Player.prototype.update = function() {
    
};

Machine.Player.prototype.render = function() {
    
};