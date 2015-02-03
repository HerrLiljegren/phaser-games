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
        
        this.load.spritesheet('sprites', 'assets/sprites.png', 32, 32, 14 * 4, 0, 0);
        this.load.tilemap('pacman-level', 'assets/pacman-level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('maptiles', 'assets/maptiles.png');
        
        this.load.audio('beginning', 'assets/sfx/pacman_beginning.wav');
        this.load.audio('chomp', 'assets/sfx/pacman_chomp.wav');
        this.load.audio('death', 'assets/sfx/pacman_death.wav');
        this.load.audio('eatfruit', 'assets/sfx/pacman_eatfruit.wav');
        this.load.audio('eatghost', 'assets/sfx/pacman_eatghost.wav');
        this.load.audio('extrapac', 'assets/sfx/pacman_extrapac.wav');
        this.load.audio('intermission', 'assets/sfx/pacman_intermission.wav');
    },
    
    create: function() {
        console.log('Preloader.create');
        this.game.state.start('Menu')
    }
}