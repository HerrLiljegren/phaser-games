/* global Machine: true, Phaser: true */
'use strict';

Machine.Menu = function(game) {};

Machine.Menu.prototype = {
    
    preload: function() {
        
    },
    
    create: function() {
        var text = "Press <Space> to start!";
        var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
    
        var t = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, text, style);
        t.anchor.set(0.5, 0.5);
        
        this.game.state.start('Game');
    },
    
    update: function() {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.game.state.start('Game');
        }
    },
    
    render: function() {
        
    }
};