'use strict';
var Pacman = Pacman || {};

Pacman.Menu = function(game) {
}

Pacman.Menu.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = '#000';
        //896, 992
		this.preloadBg = this.add.sprite(896/2,992/2, 'menuBackground');
		this.preloadBg.scale.set(0.5);
		this.preloadBg.anchor.set(0.5, 0.5);
    },
    
    create: function() {
        
        
        var text = "Press <Space> to start!";
        var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
    
        var t = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, text, style);
        t.anchor.set(0.5, 0.5);
        
        this.game.state.start('Game');
        this.game.beginningSound = this.game.add.audio('beginning', 1);
        //this.game.beginningSound.play();
        
        
    },
    update: function() {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.game.state.start('Game');
        }
    },
    render: function() {
        
    }
}