/* global Machine: true, Phaser: true */
'use strict';

Machine.Player = function(game, startX, startY) {

    Phaser.Sprite.call(this, game, startX, startY, 'full-body');
    //this.game.physics.p2.enable(this, true);
    this.game.physics.arcade.enable(this);
    
    this.game.camera.follow(this);
    this.body.collideWorldBounds = true;
    
    this.anchor.setTo(0.5);

    this.angleToPointer = 0;
    this.rotationSpeed = Phaser.Math.degToRad(1);
    this.rotationDeadZone = Phaser.Math.degToRad(10);
};

Machine.Player.prototype = Object.create(Phaser.Sprite.prototype);
Machine.Player.prototype.constructor = Machine.Player;

Machine.Player.prototype.update = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    //this.body.angularVelocity = 0;

    

    this._rotateToPointer();

    this._handleInput();
};

Machine.Player.prototype._rotateToPointer = function() {
     this.rotation = this.game.physics.arcade.angleToPointer(this);
    
     return;
    // http://www.html5gamedevs.com/topic/5987-force-sprite-to-rotate-with-p2-physics-body/
    //1. angleToPointer makes no assumption over our current angle- th thinks it's always 0
    //2. so include the current rotation of our sprite in the expression
    //3. subtract Math.PI/2 as the angle of atan2 (which is sued by angleToPointer) is rotated by 90deg (this is Math.PI/2)
    
    //Result: Now we have a delta value that if applied directly to rotation would yield
    //in a value so that the sprites top center points to the mouse.
    var deltaMouseRad = this.rotation - this.game.physics.arcade.angleToPointer(this) - Math.PI/2;
    
    //don't be confused. I want the P of 'Phaser' to point to the mouse so rotate it again by -90deg
    //deltaMouseRad = deltaMouseRad - Math.PI/2
    
    var mod = Math.PI * 2
    //modulo on float, works in js, means: clamp value to [-Math.PI*2,Math.PI*2]
    deltaMouseRad = deltaMouseRad % mod; 
    
    //lets call it phase shift, angle would jump, lets fix it
    if (deltaMouseRad != deltaMouseRad % (mod/2) ) { 
        deltaMouseRad = (deltaMouseRad < 0) ? deltaMouseRad + mod : deltaMouseRad - mod;
    }
    //speed is some factor to get the object faster to the target rotation.
    //remember we are wotking with the angle velocity and let the engine
    //rotate the body
    var speed = 150;
    this.body.rotateLeft(speed * deltaMouseRad);
};

Machine.Player.prototype._handleInput = function() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        this.game.physics.arcade.velocityFromAngle(this.angle, 300, this.body.velocity);
        //game.physics.arcade.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
        //this.body.thrust(400);
    }
};