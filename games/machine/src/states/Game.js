/* global Machine: true, Phaser: true */
'use strict';

Machine.Main = function(game) {
    this.game = game;
    
    this.player = null;
};

Machine.Main.prototype = {
    
    preload: function() {
        console.log('Main.preload');
        
    },
    
    create: function() {
        console.log('Main.create');
        
        this.player = new Machine.Player(this.game, 64, 64);
        this.game.add.existing(this.player);
    },

    update: function() {
        
    },

    render: function() {
        
    }
};
