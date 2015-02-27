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
    
    parent.addChild(this);
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

        this.fireCannon(this.leftCannon);
        this.fireCannon(this.rightCannon);
        
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
}