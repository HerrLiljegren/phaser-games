'use strict';
var Spaceshooter = Spaceshooter || {};
Spaceshooter.GameOver = function(game) {
    this.game = game;
}
Spaceshooter.GameOver.prototype = {
    preload: function() {
        console.log('Spaceshooter GameOver.preload');
    },

    create: function() {
        console.log('Spaceshooter GameOver.create');
        var gameOverSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "gameOver")
        gameOverSprite.anchor.set(0.5, 0.5);
        
        var continueSprite = this.game.add.sprite(this.game.world.centerX, gameOverSprite.position.y + 100, "spaceContinue")
        continueSprite.anchor.set(0.5, 0.5);
    },
    
    update: function() {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start("Game");
        }
    }
}