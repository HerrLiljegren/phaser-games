/* global Machine: true */
'use strict';

Machine.Preloader = function(game) {};

Machine.Preloader.prototype = {
    preload: function() {
        console.log('Preloader.preload');
        
        this.game.load.image('full-body', 'assets/player/Full_body.png');
    },
    
    create: function() {
        console.log('Preloader.create');
        this.game.state.start('Menu');
    }
};