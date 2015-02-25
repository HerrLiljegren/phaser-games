/* global Machine: true, Phaser: true */
'use strict';

Machine.Boot = function(game) {};

Machine.Boot.prototype = {
    
    preload: function() {
        console.log('Boot.preload');
        this.game.time.advancedTiming = true;
    },
    
    create: function() {
        console.log('Boot.create');
        
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        
        this.game.stage.backgroundColor = '#8ADA55';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    
        //screen size will be set automatically
        this.scale.setScreenSize(true);
        
        //  We're going to be using physics, so enable the Arcade Physics system
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.game.physics.startSystem(Phaser.Physics.P2JS)
        
        this.game.state.start('Preloader');
    }
};