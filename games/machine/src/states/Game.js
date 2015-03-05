/* global Machine: true, Phaser: true, DebugManager: true */
'use strict';

Machine.Main = function(game) {
    this.game = game;

    this.player = null;
    this.enemies = null;
    this.crosshair = null;
    
    this.once = true;
    this.LIGHT_RADIUS = 400;
};

Machine.Main.prototype = {

    preload: function() {
        console.log('Main.preload');

    },

    create: function() {
        console.log('Main.create');

        Machine.LevelManager.create();

        this.enemies = this.game.add.group();
        this.player = new Machine.Player(this.game, Machine.LevelManager.spawn.x, Machine.LevelManager.spawn.y);

        this.placeEnemies();

        this.game.add.existing(this.player);

        


        this.fogOfWarTexture = this.game.add.bitmapData(Machine.LevelManager.level.widthInPixels, Machine.LevelManager.level.heightInPixels);
        this.fogOfWarTexture.context.fillStyle = 'rgb(0 ,0, 0)';
        this.fogOfWarTexture.context.fillRect(0, 0, Machine.LevelManager.level.widthInPixels, Machine.LevelManager.level.heightInPixels);
        this.fogOfWarSprite = this.game.add.image(0, 0, this.fogOfWarTexture);
        this.fogOfWarSprite.blendMode = Phaser.blendModes.MULTIPLY;
        
        this.fogOfWarVisitedTexture = this.game.add.bitmapData(Machine.LevelManager.level.widthInPixels, Machine.LevelManager.level.heightInPixels);
        this.fogOfWarVisitedTexture.context.fillStyle = 'rgb(100 ,100, 100)';
        this.fogOfWarVisitedTexture.context.fillRect(0, 0, Machine.LevelManager.level.widthInPixels, Machine.LevelManager.level.heightInPixels);
        this.fogOfWarVisitedSprite = this.game.add.image(0, 0, this.fogOfWarVisitedTexture);
        this.fogOfWarVisitedSprite.blendMode = Phaser.blendModes.MULTIPLY;
        
        this.crosshair = this.game.add.sprite(0, 0, 'target');
        this.crosshair.anchor.setTo(0.5);

        // Create the shadow texture
        this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);

        // Create an object that will use the bitmap as a texture
        this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.x, this.shadowTexture);

        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        this.game.input.activePointer.x = this.game.width / 2;
        this.game.input.activePointer.y = this.game.height / 2;

        //Machine.LevelManager.createFogOfWar();

    },

    update: function() {
        Machine.LevelManager.update(this.player);
        //Phaser.Group.prototype.update.call(this.enemies); // Call childrens update
        this.crosshair.position.setTo(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);

        this.game.physics.arcade.collide(this.player.weaponCannons.bullets, Machine.LevelManager.layer, function(bullet, tile) {

            var direction = new Phaser.Point(Math.cos(bullet.rotation), Math.sin(bullet.rotation));
            var phaserDirection = null;
            var impactPoint = new Phaser.Point();
            if (tile.faceTop) {
                impactPoint.x = bullet.position.x;
                impactPoint.y = tile.worldY;
                phaserDirection = Phaser.UP;
            }
            if (tile.faceBottom) {
                impactPoint.x = bullet.position.x;
                impactPoint.y = tile.worldY + tile.height;
                phaserDirection = Phaser.DOWN
            }
            if (tile.faceRight) {
                impactPoint.x = tile.worldX + tile.width;
                impactPoint.y = bullet.position.y;
                phaserDirection = Phaser.RIGHT
            }
            if (tile.faceLeft) {
                impactPoint.x = tile.worldX;
                impactPoint.y = bullet.position.y;
                phaserDirection = Phaser.LEFT
            }


            this.player.weaponCannons.wallImpact(impactPoint, phaserDirection);
            bullet.kill();
        }, null, this);

        this.game.physics.arcade.overlap(this.player.weaponCannons.bullets, this.enemies, function(bullet, enemy) {
            this.player.weaponCannons.enemyImpact(enemy.position.x + (enemy.width / 2), enemy.position.y + (enemy.height / 2));

            if (enemy.alive) {
                enemy.kill();
                bullet.kill();
            }
        }, null, this);


        this.game.physics.arcade.collide(this.player, Machine.LevelManager.fogOfWarLayer, function(player, tile) {
            tile.index = 2;
        });

        this.targets = this.getNearbyTargets(this.player, this.enemies, 128, this.player.rotation + this.player.head.rotation);

        //this.updateShadowTexture();
        this.updateFogOfWarTexture();
    },

    render: function() {
        this.game.debug.spriteInfo(this.player, 32, 32);
        //this.game.debug.body(this.player);
        //this.game.debug.body(this.player.head);
        this.game.debug.text("FPS: " + this.game.time.fps, 32, 300);
        this.game.debug.text("Elapsed   : " + this.game.time.elapsed, 32, 316);
        this.game.debug.text("Elapsed MS: " + this.game.time.elapsedMS, 32, 332);
        // this.game.debug.text("MS Max: " + this.game.time.msMax, 32, 348);
        this.game.debug.text("Targets: " + this.targets.length, 32, 364);
        //this.game.debug.pixel(this.player.worldTransform.tx, this.player.worldTransform.ty, 'rgba(255,0,0,255)', 5);

        var p = new Phaser.Point(this.player.worldTransform.tx, this.player.worldTransform.ty);
        //var pb = new Phaser.Point(this.player.leftCanon.body.x, this.player.leftCanon.body.y);
        // p.rotate(this.player.worldTransform.tx, this.player.worldTransform.ty, this.player.rotation);

        //this.game.debug.pixel(p.x, p.y, 'rgba(255,0,0,255)', 3);
        //this.game.debug.pixel(p.x, p.y, 'rgba(255,0,0,255)', 3);
        //this.game.debug.pixel(pb.x, pb.y, 'rgba(255,255,0,255)', 3);

        //this.game.debug.text(this.game.camera.x + this.game.input.activePointer.x + ", " + this.game.camera.y + this.game.input.activePointer.y, 32, 364);

        //Machine.DebugManager.drawPixels();
    },

    placeEnemies: function() {
        for (var ri = 0; ri < Machine.LevelManager.rooms.length; ri++) {
            var room = Machine.LevelManager.rooms[ri];

            var enemies = Math.ceil((room.width * room.height) / 50);

            for (var i = 0; i < enemies; i++) {

                var minX = room.x * 32;
                var maxX = (room.x + room.width) * 32;
                var minY = room.y * 32;
                var maxY = (room.y + room.height) * 32;
                var x = this.game.rnd.between(minX, maxX - 24);
                var y = this.game.rnd.between(minY, maxY - 24);

                var enemy = new Machine.Enemy(this.game, this.player, x, y);
                this.enemies.add(enemy);
            }
        }
    },
    getNearbyTargets: function(origin, targets, radius, rotation) {
        //Machine.DebugManager.addCircle(this.game, 'target-radius', origin.x, origin.y, radius);


        var x = Math.cos(rotation);
        var y = Math.sin(rotation);
        var direction = new Phaser.Point(x, y);
        var targetsInRange = [];

        targets.forEachAlive(function(target) {
            var distance = Phaser.Math.distance(origin.x, origin.y, target.x, target.y);
            if (distance < radius) {

                var isInFov = Phaser.extensions.isTargetVisibleXY(origin.x, origin.y, direction, target.x, target.y, 90)

                if (isInFov) {
                    targetsInRange.push(target);
                }
            }

            if (distance < 16)
                target.kill();
        });





        //Phaser.extensions.debugDrawFov(this.game, this.player.position, direction.add(origin.x, origin.y), 90, 256);
        //console.log("Targets: ", targetsInRange.length);
        // console.log("head", this.player.head.angle)
        // console.log("body", this.player.angle)
        // console.log("head + body", this.player.head.angle + this.player.angle)


        return targetsInRange;
    },

    updateFogOfWarTexture: function() {
        
        this.fogOfWarVisitedTexture.context.fillStyle = 'rgb(50, 50, 50)';
        this.fogOfWarVisitedTexture.context.fillRect(0, 0, Machine.LevelManager.level.widthInPixels, Machine.LevelManager.level.heightInPixels);
        
         // Draw circle of light with a soft edge
        var gradient = this.fogOfWarTexture.context.createRadialGradient(
            this.player.x, this.player.y, this.LIGHT_RADIUS * 0.75,
            this.player.x, this.player.y, this.LIGHT_RADIUS);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        this.fogOfWarTexture.context.beginPath();
        this.fogOfWarTexture.context.fillStyle = gradient;
        this.fogOfWarTexture.context.arc(this.player.x, this.player.y,
            this.LIGHT_RADIUS, 0, Math.PI * 2);
        this.fogOfWarTexture.context.fill();
        
        
        var gradient2 = this.fogOfWarVisitedTexture.context.createRadialGradient(
            this.player.x, this.player.y, this.LIGHT_RADIUS * 0.75,
            this.player.x, this.player.y, this.LIGHT_RADIUS);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1.0)');
        
        this.fogOfWarVisitedTexture.context.beginPath();
        this.fogOfWarVisitedTexture.context.fillStyle = gradient;
        this.fogOfWarVisitedTexture.context.arc(this.player.x, this.player.y,
            this.LIGHT_RADIUS, 0, Math.PI * 2);
        this.fogOfWarVisitedTexture.context.fill();
        
        
        //this.fogOfWarTexture.context.fillRect(0, 0, this.game.width, this.game.height);

        
        //this.fogOfWarTexture.context.fill();
        this.fogOfWarVisitedTexture.dirty = true;
        this.fogOfWarTexture.dirty = true;
    },

    updateShadowTexture: function() {
        
        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.

        // Draw shadow
        this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
        this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

        // Draw circle of light with a soft edge
        var gradient = this.shadowTexture.context.createRadialGradient(
            this.player.worldTransform.tx, this.player.worldTransform.ty, this.LIGHT_RADIUS * 0.75,
            this.player.worldTransform.tx, this.player.worldTransform.ty, this.LIGHT_RADIUS);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(this.player.worldTransform.tx, this.player.worldTransform.ty,
            this.LIGHT_RADIUS, 0, Math.PI * 2);
        this.shadowTexture.context.fill();

        // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;

        this.lightSprite.position.setTo(this.game.camera.x, this.game.camera.y);
    }
};
