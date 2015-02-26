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
        //this.game.debug.body(this.player);
        this.game.debug.text("FPS: " + this.game.time.fps, 32, 300);
        this.game.debug.text("Frames: " + this.game.time.frames, 32, 316);
        this.game.debug.text("MS Min: " + this.game.time.msMin, 32, 332);
        this.game.debug.text("MS Max: " + this.game.time.msMax, 32, 348);
        //this.game.debug.pixel(this.player.worldTransform.tx, this.player.worldTransform.ty, 'rgba(255,0,0,255)', 5);
        
        //var p = new Phaser.Point(this.player.leftCanon.worldTransform.tx + 64, this.player.leftCanon.worldTransform.ty + 10);
        //var pb = new Phaser.Point(this.player.leftCanon.body.x, this.player.leftCanon.body.y);
        // p.rotate(this.player.worldTransform.tx, this.player.worldTransform.ty, this.player.rotation);
        
        //this.game.debug.pixel(p.x, p.y, 'rgba(255,0,0,255)', 3);
        //this.game.debug.pixel(p.x, p.y, 'rgba(255,0,0,255)', 3);
        //this.game.debug.pixel(pb.x, pb.y, 'rgba(255,255,0,255)', 3);
        
    }
};
