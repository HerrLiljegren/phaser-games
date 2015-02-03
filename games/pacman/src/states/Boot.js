'use strict';
var Pacman = Pacman || {};
Pacman.Boot = function(game) {}
Pacman.Boot.prototype = {
    preload: function() {
        //this.load.image('preloaderBg', 'img/loading-bg.png');
		//this.load.image('preloaderBar', 'img/loading-bar.png');
		this.load.image('menuBackground', 'assets/Pacman-Wallpaper.jpg')
		console.log('Boot.preload');
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
        
        this.game.state.start('Preloader');
    }
}