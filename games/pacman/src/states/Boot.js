'use strict';
var Pacman = Pacman || {};
Pacman.Boot = function(game) {}
Pacman.Boot.prototype = {
    preload: function() {
        //this.load.image('preloaderBg', 'img/loading-bg.png');
		//this.load.image('preloaderBar', 'img/loading-bar.png');
		console.log('Boot.preload');
    },
    
    create: function() {
        console.log('Boot.create');
        this.game.state.start('Preloader');
    }
}