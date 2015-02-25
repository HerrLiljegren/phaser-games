/* global Machine: true, Phaser: true, TilemapGenerator: true */
'use strict';

Machine.Preloader = function(game) {};

Machine.Preloader.prototype = {
    preload: function() {
        console.log('Preloader.preload');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.physics.startSystem(Phaser.Physics.P2JS);
    
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);
        
        this.game.load.image('full-body', 'assets/player/Full_body.png');
        this.game.load.image('bullet', 'assets/bullet.png');
        
        Machine.LevelManager.preload(this.game);
    },

    create: function() {
        console.log('Preloader.create');
        this.game.state.start('Menu');
    }
};