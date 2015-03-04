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
        this.game.load.image('body', 'assets/player/Body.png');
        this.game.load.image('legs', 'assets/player/Legs.png');
        this.game.load.spritesheet('canons', 'assets/player/Canons_anim.png', 64, 64, 3);
        this.game.load.spritesheet('canon-left', 'assets/player/Canons_anim_left.png', 64, 32, 3);
        this.game.load.spritesheet('canon-right', 'assets/player/Canons_anim_right.png', 64, 32, 3);
        // this.game.load.image('canon1', 'assets/player/Canons_anim1.png');
        // this.game.load.image('canon2', 'assets/player/Canons_anim2.png');
        // this.game.load.image('canon3', 'assets/player/Canons_anim3.png');
        
        
        
        this.game.load.image('arrow', 'assets/arrow.png');
        this.game.load.image('bullet', 'assets/bullet.png');
        this.game.load.spritesheet('soldier', 'assets/soldier.png', 16, 16);
        this.game.load.image('target', 'assets/target.png');
        this.game.load.image('smoke', 'assets/smoke.png');
        this.game.load.image('debri', 'assets/debri.png');
        this.game.load.spritesheet('blood', 'assets/blood.png', 32, 32, 16);
        
        Machine.LevelManager.preload(this.game);
    },

    create: function() {
        console.log('Preloader.create');
        this.game.state.start('Menu');
    }
};