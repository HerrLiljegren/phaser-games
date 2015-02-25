/* global Machine: true, Phaser: true */
'use strict';

Machine.Main = function(game) {
    this.game = game;
    
    this.player = null;
    this.map = null;
    this.layer1 = null;
};

Machine.Main.prototype = {
    
    preload: function() {
        console.log('Main.preload');
        
    },
    
    create: function() {
        console.log('Main.create');
        
        Machine.LevelManager.create();
        
        this.player = new Machine.Player(this.game, Machine.LevelManager.spawn.x, Machine.LevelManager.spawn.y);
        this.game.add.existing(this.player);
    },

    update: function() {
        Machine.LevelManager.update(this.player);
    },

    render: function() {
        this.game.debug.spriteInfo(this.player, 32, 32);
        this.game.debug.text("FPS: " + this.game.time.fps, 32, 300);
        this.game.debug.pixel(0, 0, 'rgba(255,0,0,255)', 5);
    }
};
