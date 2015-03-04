/* global Machine: true, Phaser: true, Tools: true */
'use strict';

Machine.WeaponCannons = function(game, parent, options) {
    Phaser.Group.call(this, game);
    
    
    
    
    this.leftCannon = {
        sprite: this.create(-32, -32, 'canon-left'),
        muzzle: new Phaser.Point(32, -18)
    };
    this.leftCannon.sprite.animations.add('fire');
    
    this.rightCannon = {
        sprite: this.create(-32, 0, 'canon-right'),
        muzzle: new Phaser.Point(32, 24)
    };
    this.rightCannon.sprite.animations.add('fire');
    
    //  Our bullet group
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(300, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    this.bulletVelocity = 1000; // pixels per second
    
    this.rateOfFire = 2; // Bullets per second
    this.maxRateOfFire = 10;
    this.currentRateOfFire = this.rateOfFire;
    
    this.spinUpTime = 4; // Seconds until max rate of fire is reached
    this.spinUpFactor = this.spinUpTime / this.maxRateOfFire;
    this.nextRateOfFireIncrement = 0;
    
    
    this.fireRate = 50;
    this.nextFire = 0;
    this.isShooting = false;
    this.fireLeft = true;
    
    parent.addChild(this);
    
    this.createParticles();
};

Machine.WeaponCannons.prototype = Object.create(Phaser.Group.prototype);
Machine.WeaponCannons.prototype.constructor = Machine.WeaponCannons;



Machine.WeaponCannons.prototype.update = function() {
    //this.leftCannon.sprite.rotation = Phaser.Math.clamp(this.game.physics.arcade.angleToPointer(this) - this.rotation, Phaser.Math.degToRad(-5), Phaser.Math.degToRad(5));
    //this.rightCannon.sprite.rotation = Phaser.Math.clamp(this.game.physics.arcade.angleToPointer(this) - this.rotation, Phaser.Math.degToRad(-5), Phaser.Math.degToRad(5));
    
    if(this.isShooting) {
        
        if(this.game.time.now > this.nextRateOfFireIncrement && this.currentRateOfFire != this.maxRateOfFire)
        {
            this.nextRateOfFireIncrement = this.game.time.now + (1000*this.spinUpFactor);
            this.currentRateOfFire++;
        }
        
        this.fire();
    } else {
        this.currentRateOfFire = this.rateOfFire;
        this.leftCannon.sprite.animations.stop('fire');
        this.rightCannon.sprite.animations.stop('fire');
    }
};


Machine.WeaponCannons.prototype.fire = function() {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.game.time.now + (1000/this.currentRateOfFire);

        if(this.fireLeft) {
            this.fireCannon(this.leftCannon);
        } else {
            this.fireCannon(this.rightCannon);
        }
        
        this.fireLeft = !this.fireLeft;
        
        return true;
    }
    
    return false;
};

Machine.WeaponCannons.prototype.fireCannon = function(cannon) {
        var bullet = this.bullets.getFirstExists(false);
        var parrentWorldPosition = new Phaser.Point(this.parent.world.x, this.parent.world.y);
        var muzzleWorldPosition = Phaser.Point.add(parrentWorldPosition, cannon.muzzle);
        
        
        // Rotate muzzle worldposition around the parents worldposition (Mech body)
        // Use the combined rotation of the Mech body rotation and Mech legs rotation (this.parent and this.parent.parent)
        muzzleWorldPosition.rotate(parrentWorldPosition.x, parrentWorldPosition.y, this.parent.rotation + this.parent.parent.rotation, false);
        
        
        
        
        // Move the bullet to the muzzle point
        bullet.reset(muzzleWorldPosition.x, muzzleWorldPosition.y);
        
        // Set the velocity of the bullet
        // Use the combined angle of the Mech body and the Mech legs
        // Rotate the bullet to this angle, and set the bullet speed to a constant
        this.game.physics.arcade.velocityFromAngle(this.parent.parent.angle + this.parent.angle, this.bulletVelocity, bullet.body.velocity);
        bullet.angle = this.parent.parent.angle + this.parent.angle;
        
        // Start the fire animation
        cannon.sprite.animations.play('fire', 10, true);
};

Machine.WeaponCannons.prototype.createParticles = function() {
    this.smokeEmitter = this.game.add.emitter(0, 0, 100);
    this.smokeEmitter.makeParticles('smoke');
    this.smokeEmitter.setAlpha(0.5, 0, 2000);
    this.smokeEmitter.setScale(0.5, 1, 0.5, 1, 2000);
    this.smokeEmitter.gravity = 0;
    this.smokeEmitter.minParticleSpeed.setTo(0, -40);
    this.smokeEmitter.maxParticleSpeed.setTo(-40, 40);
    
    this.debriEmitter = this.game.add.emitter(0, 0, 100);
    this.debriEmitter.makeParticles('debri');
    this.debriEmitter.setAlpha(1, 1, 2000);
    this.debriEmitter.setScale(1, 2, 1, 2, 2000);
    this.debriEmitter.gravity = 0;
    var speed = 360;
    this.debriEmitter.minParticleSpeed.setTo(0, -speed);
    this.debriEmitter.maxParticleSpeed.setTo(-speed, speed);
    
    this.bloodEmitter = this.game.add.emitter(0, 0, 100);
    this.bloodEmitter.makeParticles('blood', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    this.bloodEmitter.setAlpha(1, 0, 2000);
    this.bloodEmitter.setScale(0.1, 0.5, 0.1, 0.5, 2000);
    this.bloodEmitter.gravity = 0;
    speed = 360;
    this.bloodEmitter.minParticleSpeed.setTo(-speed, -speed);
    this.bloodEmitter.maxParticleSpeed.setTo(speed, speed);
};

Machine.WeaponCannons.prototype.wallImpact = function(origin, phaserDirection) {
    this.smokeEmitter.x = origin.x;
    this.smokeEmitter.y = origin.y;
    
    this.debriEmitter.x = origin.x;
    this.debriEmitter.y = origin.y;
    
    var smokeSpeed = 40;
    var debriSpeed = 360;
    
    switch(phaserDirection) {
        case Phaser.UP:
            this.smokeEmitter.minParticleSpeed.setTo(-smokeSpeed, 0);
            this.smokeEmitter.maxParticleSpeed.setTo(smokeSpeed, -smokeSpeed);
            this.debriEmitter.minParticleSpeed.setTo(-debriSpeed, 0);
            this.debriEmitter.maxParticleSpeed.setTo(debriSpeed, -debriSpeed);
            break;
        case Phaser.DOWN:
            this.smokeEmitter.minParticleSpeed.setTo(-smokeSpeed, 0);
            this.smokeEmitter.maxParticleSpeed.setTo(smokeSpeed, smokeSpeed);
            this.debriEmitter.minParticleSpeed.setTo(-debriSpeed, 0);
            this.debriEmitter.maxParticleSpeed.setTo(debriSpeed, debriSpeed);
            break;
        case Phaser.LEFT:
            this.smokeEmitter.minParticleSpeed.setTo(0, -smokeSpeed);
            this.smokeEmitter.maxParticleSpeed.setTo(-smokeSpeed, smokeSpeed);
            this.debriEmitter.minParticleSpeed.setTo(0, -debriSpeed);
            this.debriEmitter.maxParticleSpeed.setTo(-debriSpeed, debriSpeed);
            break;
        case Phaser.RIGHT:
            this.smokeEmitter.minParticleSpeed.setTo(0, -smokeSpeed);
            this.smokeEmitter.maxParticleSpeed.setTo(smokeSpeed, smokeSpeed);
            this.debriEmitter.minParticleSpeed.setTo(0, -debriSpeed);
            this.debriEmitter.maxParticleSpeed.setTo(debriSpeed, debriSpeed);
            break;
    }
    
    this.smokeEmitter.start(true, 1000, null, 30);
    this.debriEmitter.start(true, 150, null, 7);
};

Machine.WeaponCannons.prototype.enemyImpact = function(x, y) {
    this.bloodEmitter.x = x;
    this.bloodEmitter.y = y;
    
    this.bloodEmitter.start(true, 150, null, 5);
};
