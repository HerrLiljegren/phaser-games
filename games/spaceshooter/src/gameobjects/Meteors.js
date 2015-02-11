var Spaceshooter = Spaceshooter || {};
Spaceshooter.Meteors = function(game) {
    this.game = game;
    this.timer = null;
    
    
    //groups
    this.meteors = this.game.add.group();
    this.meteors.enableBody = true;
    this.meteors.physicsBodyType = Phaser.Physics.ARCADE;
    this.meteors.createMultiple(20, 'spritesheet', 'meteorBrown_big1.png', false); 
    this.meteors.setAll('anchor.x', 0.5);
    this.meteors.setAll('anchor.y', 0.5);
    this.meteors.setAll('outOfBoundsKill', true);
    this.meteors.setAll('checkWorldBounds', true);    
    

    //Meteors audio
    this.sfx = {
        Rotating: null
    }
    
    this.MeteorsParameters = {
        Movement: {
            DefaultSpeed: 400,
            SpeedBoostFactor: 1,
            SpeedFactorDifferenceYAxis: 1.10
        },
        Spawning: {
            Timer: 500,
            Items: 20,
            NextFire: 0
        }
    }
    
    
    //movement
    this.movement = {
        SpeedXAxis: this.MeteorsParameters.Movement.DefaultSpeed,
        SpeedYAxis: this.MeteorsParameters.Movement.DefaultSpeed * this.MeteorsParameters.Movement.SpeedFactorDifferenceYAxis
    }
    
    
};

Spaceshooter.Meteors.prototype = {
    create: function () {
        
    },
    
    update: function() {
        this.spawnMeteors();
    },

    render: function() {
        //this.game.debug.spriteInfo(this.Meteors, 32, 32);
        //this.game.debug.body(this.Meteors);
        
    },
    
    spawnMeteors: function () {
        if (this.game.time.now > this.MeteorsParameters.Spawning.Timer + this.MeteorsParameters.Spawning.NextFire && this.meteors.countDead() > 0)
        {
            this.MeteorsParameters.Spawning.NextFire = this.game.time.now + this.MeteorsParameters.Spawning.Timer;
    
            var meteor = this.meteors.getFirstExists(false);
    
            var fromX = this.game.rnd.integerInRange(0, this.game.world.width);
            var fromY = -meteor.height;
            var toX = this.game.rnd.integerInRange(0, this.game.world.width);
            var toY = this.game.world.height + meteor.height
            
            
            meteor.reset(fromX, fromY);
            meteor.rotation = Phaser.Math.angleBetween(fromX, fromY, toX, toY);
    
            
            this.game.physics.arcade.moveToXY(meteor, toX, toY, 400);
        }        
    }
};