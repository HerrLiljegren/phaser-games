'use strict';
var Spaceshooter = Spaceshooter || {};
Spaceshooter.Boot = function(game) {}
Spaceshooter.Boot.prototype = {
    preload: function() {
		console.log('Boot.preload');
		
		//logo
        this.load.image("logo", "assets/States/logo.png");
    },
    
    create: function() {
        console.log('Boot.create');
        
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    
        //screen size will be set automatically
        this.scale.setScreenSize(true);
        
        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.game.state.start('Preload');
    }
}