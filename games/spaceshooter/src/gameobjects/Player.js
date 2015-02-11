var Spaceshooter = Spaceshooter || {};
Spaceshooter.Player = function(game) {
    this.game = game;
    
    //player sprite
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "spritesheet", "playerShip3_red.png");
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.player.anchor.set(0.5, 0.5);
    this.player.body.drag.set(0.2);
    
    //player ammo/bullets
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(50, 'spritesheet', 'laserGreen05.png', false);
    this.bullets.setAll("outOfBoundsKill", true);
    this.bullets.setAll("checkWorldBounds", true);
    this.bullets.setAll("anchor.y", 0.5);
    this.bullets.setAll("anchor.x", 0.5);
    
    //stats
    this.playerStats = {
        MeteorKills: 0,
        EnemiesKilled: 0,
        ShotsFired: 0
    }

    //player audio
    this.sfx = {
        Shoot: this.game.add.audio("playerShoot"),
        ShieldUp: null,
        ShieldDown: null
    }
    
    this.playerParameters = {
        Movement: {
            DefaultSpeed: 700,
            SpeedBoostFactor: 1,
            SpeedFactorDifferenceYAxis: 1.10
        },
        Shooting: {
            FireRateCapFactor: 1,
            FireRateCapDefault: 400,
            BulletSpeedFactor: 1,
            BulletDefaultSpeed: 1000
        }
    }
    
    
    //movement
    this.movement = {
        SpeedXAxis: this.playerParameters.Movement.DefaultSpeed,
        SpeedYAxis: this.playerParameters.Movement.DefaultSpeed * this.playerParameters.Movement.SpeedFactorDifferenceYAxis
    }
    
    this.movingDirection = {
        UP_DOWN: false,
        LEFT_RIGHT: false
    }
    
    //shooting parameters
    this.shootingMechanics = {
        FireRateCap: this.playerParameters.Shooting.FireRateCapDefault * this.playerParameters.Shooting.FireRateCapFactor,
        LastFired: 0,
        ShotsFired: 0,
        BulletSpeed: this.playerParameters.Shooting.BulletDefaultSpeed * this.playerParameters.Shooting.BulletSpeedFactor
    }
    
};

Spaceshooter.Player.prototype = {
    update: function() {
        // this.sprite.angle = Phaser.Math.radToDeg(
        //         this.game.physics.arcade.moveToPointer(this.sprite, 60, this.game.input.activePointer, 500) + Phaser.Math.degToRad(90)
        //     );
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.player.body.velocity.y = -(this.movement.SpeedYAxis);
            this.game.background.speed = this.game.background.speed * this.playerParameters.Movement.SpeedBoostFactor;
            this.movingDirection.UP_DOWN = true;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.player.body.velocity.y = this.movement.SpeedYAxis;
            this.game.background.speed = 10;
            this.movingDirection.UP_DOWN = true;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.body.velocity.x = -(this.movement.SpeedXAxis);
            this.movingDirection.LEFT_RIGHT = true;
        }     
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.body.velocity.x = this.movement.SpeedXAxis; 
            this.movingDirection.LEFT_RIGHT = true;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            
            this.shoot();
        }
        
        if(!this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && 
        !this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && 
        !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && 
        !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ){
            this.game.background.speed = 10;
        }
        
        if(this.movingDirection.LEFT_RIGHT == false) {
            this.player.body.velocity.x = 0;
        }
        
        if(this.movingDirection.UP_DOWN == false) {
            this.player.body.velocity.y = 0;
        }
        
        this.movingDirection.UP_DOWN = false;
        this.movingDirection.LEFT_RIGHT = false;
        
        
        //check for collisions between player bullets and enemies
        
        
    },

    render: function() {
        //this.game.debug.spriteInfo(this.player, 32, 32);
        //this.game.debug.body(this.player);
    },
    
    shoot: function() {

        if(this.playerStats.ShotsFired == 0 || this.game.time.now - this.shootingMechanics.LastFired >=  this.shootingMechanics.FireRateCap) {
            
            //reset timer
            this.shootingMechanics.LastFired = this.game.time.now;
            
            //add one to shots fired
            this.playerStats.ShotsFired++;
             
            //play shoot sfx
            if(this.sfx.Shoot.isPlaying) {
                this.sfx.Shoot.stop();
            }
            this.sfx.Shoot.play();
            
            //add laserbullet sprite to the scene and group for collision detection
            var laserbullet = this.bullets.getFirstExists(false);
            laserbullet.reset(this.player.body.center.x, this.player.body.position.y - 20);
            laserbullet.body.velocity.y = Phaser.Math.min(this.player.body.velocity.y + -this.shootingMechanics.BulletSpeed, -this.shootingMechanics.BulletSpeed);

        }
    }
};