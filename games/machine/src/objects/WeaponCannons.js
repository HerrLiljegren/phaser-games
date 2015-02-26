/* global Machine: true, Phaser: true, Tools: true */
'use strict';

Machine.WeaponCannons = function(game, parent, ox, oy, key, options) {
    //Phaser.Sprite.call(this, game, ox, oy, key);
    
    this.leftCannon = {
        sprite: new Phaser.Sprite(game, -32, -32, 'canon-left'),
        muzzle: new Phaser.Point(64, 10)
    };
    
    this.rightCannon = {
        sprite: new Phaser.Sprite(game, -32, 0, 'canon-right'),
        muzzle: new Phaser.Point(64, 21)
    };
    
    //  Our bullet group
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    this.fireRate = 500;
    this.nextFire = 0;
    
    parent.addChild(this);
};

//Machine.WeaponCannons.prototype = Object.create(Phaser.Sprite.prototype);
//Machine.WeaponCannons.prototype.constructor = Machine.WeaponCannons;

Machine.WeaponCannons.prototype.update = function() {
    this.rotation = Phaser.Math.clamp(this.game.physics.arcade.angleToPointer(this) - this.rotation, Phaser.Math.degToRad(-5), Phaser.Math.degToRad(5));
};


Machine.WeaponCannons.prototype.fire = function() {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstExists(false);

        this.animations.stop('fire');
        this.animations.play('fire', 10, false);
        var mworld = new Phaser.Point(this.world.x + this.options.muzzle.x, this.world.y + this.options.muzzle.y);
        mworld.rotate(this.world.x, this.world.y, this.parent.rotation + this.rotation, false);
        bullet.reset(mworld.x, mworld.y);
        
        this.game.physics.arcade.velocityFromAngle(this.parent.angle + this.angle, 1000, bullet.body.velocity);
        bullet.angle = this.parent.angle + this.angle;
        
        return true;
    }
    
    return false;
};