var Spaceshooter = Spaceshooter || {};
Spaceshooter.SpaceShips = function(game, player) {
    this.game = game;
    this.timer = null;
    this.player = player;


    //groups
    this.ships = this.game.add.group();
    this.ships.enableBody = true;
    this.ships.physicsBodyType = Phaser.Physics.ARCADE;
    this.ships.createMultiple(20, 'spritesheet', 'enemyBlue5.png', false);
    this.ships.setAll('anchor.x', 0.5);
    this.ships.setAll('anchor.y', 0.5);
    this.ships.setAll('outOfBoundsKill', true);
    this.ships.setAll('checkWorldBounds', true);

    this.shipBullets = this.game.add.group();
    this.shipBullets.enableBody = true;
    this.shipBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.shipBullets.createMultiple(100, 'spritesheet', 'laserRed13.png', false);
    this.shipBullets.setAll('anchor.x', 0.5);
    this.shipBullets.setAll('anchor.y', 0.5);
    this.shipBullets.setAll('outOfBoundsKill', true);
    this.shipBullets.setAll('checkWorldBounds', true);


    //Meteors audio
    this.sfx = {
        Rotating: null
    }

    this.ShipParameters = {
        Movement: {
            DefaultSpeed: 200,
            SpeedBoostFactor: 1,
            SpeedFactorDifferenceYAxis: 1.10
        },
        Spawning: {
            Timer: 800,
            Items: 20,
            NextFire: 0
        },
        Shooting: {
            FireRateCapFactor: 1,
            FireRateCapDefault: 700,
            BulletSpeedFactor: 1,
            BulletDefaultSpeed: 1000
        }
    }

    //shooting parameters
    this.ShootingMechanics = {
        FireRateCap: this.ShipParameters.Shooting.FireRateCapDefault * this.ShipParameters.Shooting.FireRateCapFactor,
        LastFired: 0,
        ShotsFired: 0,
        BulletSpeed: this.ShipParameters.Shooting.BulletDefaultSpeed * this.ShipParameters.Shooting.BulletSpeedFactor
    }

    this.Stats = {
        ShotsFired: 0
    }


    //movement
    this.movement = {
        SpeedXAxis: this.ShipParameters.Movement.DefaultSpeed,
        SpeedYAxis: this.ShipParameters.Movement.DefaultSpeed * this.ShipParameters.Movement.SpeedFactorDifferenceYAxis
    }


};

Spaceshooter.SpaceShips.prototype = {
    create: function() {

    },

    update: function() {
        if (this.game.time.now > this.ShipParameters.Spawning.Timer + this.ShipParameters.Spawning.NextFire && this.ships.countDead() > 0) {
            this.spawnShips();
        }

        //add all living ships to array so they can shoot
        var visibleShips = [];
        this.ships.forEachAlive(function(ship) {
            if (ship.worldVisible) {
                visibleShips.push(ship);
            }

        });

        if (this.Stats.ShotsFired == 0 || this.game.time.now - this.ShootingMechanics.LastFired >= this.ShootingMechanics.FireRateCap) {
            for (var i in visibleShips) {
                var ship = visibleShips[i];
                var playerPos = this.player.position.clone();
                ship.body.angle =   playerPos.subtract(ship.body.position.x, ship.body.position.y).add(ship.body.position.x, ship.body.position.y);
                var shipBullet = this.shipBullets.getFirstExists(false);
                shipBullet.reset(ship.body.center.x, ship.body.y + 40);
                shipBullet.body.velocity.y = this.ShootingMechanics.BulletSpeed;
                this.Stats.ShotsFired++;
                this.ShootingMechanics.LastFired = this.game.time.now;
            }
        }





    },

    render: function() {
        //this.game.debug.spriteInfo(this.Meteors, 32, 32);
        //this.game.debug.body(this.Meteors);

    },

    spawnShips: function() {
        this.ShipParameters.Spawning.NextFire = this.game.time.now + this.ShipParameters.Spawning.Timer;

        var ship = this.ships.getFirstExists(false);

        var fromX = this.game.rnd.integerInRange(0, this.game.world.width);
        var fromY = -ship.height;
        var toX = this.game.rnd.integerInRange(0, this.game.world.width);
        var toY = this.game.world.height + ship.height

        ship.reset(fromX, fromY);
        //this.game.physics.arcade.moveToXY(ship, toX, toY, 400);
        
        this.game.physics.arcade.moveToObject(ship, this.player, this.movement.SpeedYAxis);

    }
};