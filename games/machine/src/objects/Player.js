/* global Machine: true, Phaser: true */
'use strict';

Machine.Player = function(game, startX, startY) {

    Phaser.Sprite.call(this, game, startX, startY, 'body');
    
    this.leftCanon = this.game.add.sprite(-32, -32, 'canon-left');
    this.leftCanon.animations.add('fire');
    this.rightCanon = this.game.add.sprite(-32, 0, 'canon-right');
    this.rightCanon.animations.add('fire');
    this.addChild(this.leftCanon);
    this.addChild(this.rightCanon);
    
    this.fireLeft = true;
    
    //this.game.physics.p2.enable(this, true);
    this.game.physics.arcade.enable(this);
    
    this.game.camera.follow(this);
    this.body.collideWorldBounds = true;
    
    this.anchor.setTo(0.5);

    this.maxSpeed = 250;
    
    
    
    //  Our bullet group
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    this.fireRate = 50;
    this.nextFire = 0;
};

Machine.Player.prototype = Object.create(Phaser.Sprite.prototype);
Machine.Player.prototype.constructor = Machine.Player;

Machine.Player.prototype.update = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.angularVelocity = 0;

    

    this._rotateToPointer();

    this._handleInput();
};

Machine.Player.prototype._rotateToPointer = function() {
    
    this.rightCanon.rotation = Phaser.Math.clamp(this.game.physics.arcade.angleToPointer(this) - this.rotation, Phaser.Math.degToRad(-5), Phaser.Math.degToRad(5));
    this.leftCanon.rotation = Phaser.Math.clamp(this.game.physics.arcade.angleToPointer(this) - this.rotation, Phaser.Math.degToRad(-5), Phaser.Math.degToRad(5));
     
     //this.rightCanon.rotation = (this.game.physics.arcade.angleToPointer(this) - this.rotation) % Phaser.Math.degToRad(5);
     //this.leftCanon.rotation = (this.game.physics.arcade.angleToPointer(this) - this.rotation) % Phaser.Math.degToRad(5);
     
     //console.log(this.rightCanon.rotation, this.leftCanon.rotation);
     
     //console.log((this.game.physics.arcade.angleToPointer(this) - this.rotation) % Phaser.Math.degToRad(5));
     
    
     //return;
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
    //this.body.rotateLeft(speed * deltaMouseRad);
    //this.rotation = deltaMouseRad;
};

Machine.Player.prototype._handleInput = function() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        var speed;
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            speed = this.maxSpeed * 2;
        } else {
            speed = this.maxSpeed;
        }
        
        this.game.physics.arcade.velocityFromAngle(this.angle, speed, this.body.velocity);
        //game.physics.arcade.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
        //this.body.thrust(400);
    }
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.body.angularVelocity = -200;
    } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.body.angularVelocity = 200;
    }
    
    if(this.game.input.activePointer.isDown) {
        this.fire();
    } else {
        
    }
};

Machine.Player.prototype.fire = function() {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstExists(false);

        var pl = new Phaser.Point(this.leftCanon.world.x + 64, this.leftCanon.world.y+10);
        var pr =  new Phaser.Point(this.rightCanon.world.x + 64, this.rightCanon.world.y+21);
        var p;
        
        var bindex = this.bullets.getIndex(bullet);
        
        
        if(this.fireLeft) {
            p = pl;
            this.leftCanon.animations.stop(true, true);
            this.leftCanon.animations.play('fire', 10, false);
            
            p.rotate(this.leftCanon.world.x, this.leftCanon.world.y, this.rotation + this.leftCanon.rotation);
            bullet.reset(p.x, p.y);
            
            this.game.physics.arcade.velocityFromAngle(this.angle + this.leftCanon.angle, 1000, bullet.body.velocity);
            bullet.angle = this.angle + this.leftCanon.angle;
            
        } else {
            p = pr;
            this.rightCanon.animations.stop(true, true);
            this.rightCanon.animations.play('fire', 10, false);
            
            p.rotate(this.rightCanon.world.x, this.rightCanon.world.y, this.rotation + this.rightCanon.rotation);
            bullet.reset(p.x, p.y);
            
            this.game.physics.arcade.velocityFromAngle(this.angle + this.rightCanon.angle, 1000, bullet.body.velocity);
            bullet.angle = this.angle + this.rightCanon.angle;
        }
        
        this.fireLeft = !this.fireLeft;
        
        

        //bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer);
        
    }
};