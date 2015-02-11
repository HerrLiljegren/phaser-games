'use strict';
var Pacman = Pacman || {};
Pacman.GameOver = function(game) {}
Pacman.GameOver.prototype = {
    preload: function() {
		console.log('GameOver.preload');
    },
    
    create: function() {
        console.log('GameOver.create');
        
        
    },
    
    update: function() {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start("Menu");
        }
    }
}