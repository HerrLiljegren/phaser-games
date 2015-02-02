'use strict';
var Pacman = Pacman || {};
Pacman.Preloader = function(game) {}
Pacman.Preloader.prototype = {
    preload: function() {
        console.log('Preloader.preload');
        /*this.game.stage.backgroundColor = '#16181a';
		this.preloadBg = this.add.sprite((320-297)/2, (480-145)/2, 'preloaderBg');
		this.preloadBar = this.add.sprite((320-158)/2, (480-50)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
		
        this.game.load.spritesheet('sprites', 'assets/sprites.png', 32, 32, 14 * 4, 0, 0);
        this.game.load.tilemap('pacman-level', 'assets/pacman-level.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('maptiles', 'assets/maptiles.png');*/
    },
    
    create: function() {
        console.log('Preloader.create');
        this.game.state.start('Game')
    }
}