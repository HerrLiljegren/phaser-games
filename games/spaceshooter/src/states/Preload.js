'use strict';
var Spaceshooter = Spaceshooter || {};
Spaceshooter.Preload = function(game) {}
Spaceshooter.Preload.prototype = {
    preload: function() {
        console.log('Spaceshooter Preload.preload');
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo")
        logo.anchor.set(0.5, 0.5);        
        
        
        //altas spritesheet
        this.load.atlasXML("spritesheet", "assets/Spritesheet/sheet.png", "assets/Spritesheet/sheet.xml");

        //audio
        this.load.audio("playerShoot", "assets/Audio/sfx_laser1.ogg");

        //background
        this.load.image("background", "assets/Backgrounds/purple.png")
        
        //game-over image
        this.load.image("gameOver", "assets/States/game-over.png");
        
        //press space to continue image
        this.load.image("spaceContinue", "assets/States/continue.png");

    },

    create: function() {
        console.log('Spaceshooter Preload.create');
        this.game.state.start('Game');
    }
}