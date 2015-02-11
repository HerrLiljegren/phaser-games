'use strict';
Pacman.Ghost = function(main, index) {
    this.main = main;
    this.game = main.game;
    this.player = main.player;
    this.tilemap = null;

    this.sprite = this.game.add.sprite(32 * 11, 32 * 11, 'sprites');
    this.sprite.name = "ghost";
    this.sprite.me = this;
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.animations.add('weak', [12, 13], 4, true);
    this.index = index;
    switch (this.index) {
        case 0:
            this._addRedAnimations();
            this.homePosition = new Phaser.Point(6 * 32, 1 * 32);
            this.targetPosition = new Phaser.Point(6 * 32, 1 * 32);
            this.startPosition = new Phaser.Point(32 * 9, 32 * 11);
            this.name = "Blinky";
            this.color = 'rgba(255,0,0,1)';
            this.sprite.frame = 0;
            break;

        case 1:
            this._addYellowAnimations();
            this.homePosition = new Phaser.Point(21 * 32, 1 * 32);
            this.targetPosition = new Phaser.Point(21 * 32, 1 * 32);
            this.startPosition = new Phaser.Point(32 * 14, 32 * 13);
            this.name = "Clyde";
            this.color = 'rgba(255,255,0,1)';
            this.sprite.frame = 2;
            break;

        case 2:
            this._addPinkAnimations();
            this.homePosition = new Phaser.Point(8 * 32, 29 * 32);
            this.targetPosition = new Phaser.Point(8 * 32, 29 * 32);
            this.startPosition = new Phaser.Point(32 * 13, 32 * 14);
            this.name = "Pinky";
            this.color = 'rgba(255,182,193,1)';
            this.sprite.frame = 4;
            break;

        case 3:
            this._addBlueAnimations();
            this.homePosition = new Phaser.Point(19 * 32, 29 * 32);
            this.targetPosition = new Phaser.Point(19 * 32, 29 * 32);
            this.startPosition = new Phaser.Point(32 * 14, 32 * 14);
            this.name = "Inky";
            this.color = 'rgba(0,0,255,1)';
            this.sprite.frame = 6;
            break;
    }

    this.reset();
    this.respawnPosition = new Phaser.Point(32*13,32*14);
    this.activeTween;

    this.direction = Phaser.RIGHT;
    this.directionVector = new Phaser.Point();
    this.tweenDirection;
    this.moving = false;
    this.lastTimeISawPlayer = 0;
    this.activeLevelStage = 0;
    this.activeLevelStageDirty = true;
    this.playerWentSuper = false;
    this.currentStageTimer;
    //this.sprite.body.velocity.y = -this.maxSpeed;
    //this.sprite.animations.play('right');
}

Pacman.Ghost.prototype.update = function() {

    this.updateLevelStage();

    //this.targetPosition = this.player.sprite.position;
    if (!this.moving && Pacman.Ghost.Behaviour[this.name].active(this.game)) {

        this.activeTween = this.game.add.tween(this.sprite);
        this.activeTween.to(this.tweenDirection, Pacman.Ghost.Behaviour[this.name].maxSpeed, Phaser.Easing.Linear.None, true)
            .onComplete.add(this._calculateMovement, this);


        if (this.player.isSuper) {
            this.sprite.animations.play('weak');
        }
        else {
            switch (this.direction) {
                case Phaser.UP:
                    this.sprite.animations.play('up');
                    break;
                case Phaser.DOWN:
                    this.sprite.animations.play('down');
                    break;
                case Phaser.LEFT:
                    this.sprite.animations.play('left');
                    break;
                case Phaser.RIGHT:
                    this.sprite.animations.play('right');
                    break;
            }
        }

        //playerPosition, playerDirection, homePosition, state, tilemapLevel

        switch (this.state) {
            case Pacman.Ghost.States.Scatter:
                this.targetPosition = new Phaser.Point(this.homePosition.x, this.homePosition.y);
                break;
            case Pacman.Ghost.States.Chase:
                this.targetPosition = Pacman.Ghost.Behaviour[this.name].selectTarget(this.player.sprite.position, this.player.direction, this.homePosition, this.state, this.tilemap.level, this.sprite.position, this.main.ghosts);
                break;
                case Pacman.Ghost.States.Scared:
                    break;
        }


        /*var canISeeYou = this.isPlayerVisible(this.player.sprite);
        if (canISeeYou) {
            console.log(this.name, "sees player");
            this.targetPosition = this.player.sprite.position;
        }
        else {
            this.targetPosition = this.homePosition;
        }*/
        this.moving = true;
    }
};

Pacman.Ghost.prototype.render = function() {
    //this.game.debug.body(this.sprite);

    this.game.debug.spriteInfo(this.sprite, 32 * 28, 32);

    //var tile = Pacman.Helpers.Tilemap.getTileInfrontOf(this.player.sprite.position.x, this.player.sprite.position.y, this.tilemap.level, this.player.direction, 4)
    //this.game.debug.geom(new Phaser.Rectangle(tile.x*32, tile.y*32, 32, 32));

    //var c = new Phaser.Circle(this.sprite.body.center.x, this.sprite.body.center.y, Pacman.Ghost.Behaviour[this.name].viewDistance);
    //this.game.debug.geom(c);
    this.game.debug.geom(new Phaser.Rectangle(this.targetPosition.x, this.targetPosition.y, 32, 32), this.color);
    return;
    switch (this.tweenDirection.direction) {
        case Phaser.UP:

            Phaser.extensions.debugDrawFovXY(this.game, this.sprite.body.center.x, this.sprite.body.center.y, this.tweenDirection.x + 16, this.tweenDirection.y, Pacman.Ghost.Behaviour[this.name].fov, Pacman.Ghost.Behaviour[this.name].viewDistance);
            break;
        case Phaser.DOWN:

            Phaser.extensions.debugDrawFovXY(this.game, this.sprite.body.center.x, this.sprite.body.center.y, this.tweenDirection.x + 16, this.tweenDirection.y + 32, Pacman.Ghost.Behaviour[this.name].fov, Pacman.Ghost.Behaviour[this.name].viewDistance);
            break;
        case Phaser.LEFT:

            Phaser.extensions.debugDrawFovXY(this.game, this.sprite.body.center.x, this.sprite.body.center.y, this.tweenDirection.x, this.tweenDirection.y + 16, Pacman.Ghost.Behaviour[this.name].fov, Pacman.Ghost.Behaviour[this.name].viewDistance);
            break;
        case Phaser.RIGHT:
            Phaser.extensions.debugDrawFovXY(this.game, this.sprite.body.center.x, this.sprite.body.center.y, this.tweenDirection.x + 32, this.tweenDirection.y + 16, Pacman.Ghost.Behaviour[this.name].fov, Pacman.Ghost.Behaviour[this.name].viewDistance);
            break;
    }

};

Pacman.Ghost.prototype.die = function(){
    this.tweenDirection = this.respawnPosition;
    this.moving = false;
    if(this.activeTween) this.activeTween.stop();
};

Pacman.Ghost.prototype.reset = function() {
    this.moving = false;
    if(this.activeTween) this.activeTween.stop();
    this.sprite.reset(this.startPosition.x, this.startPosition.y);
    this.tweenDirection = new Phaser.Point(this.startPosition.x, this.startPosition.y);
    //this.state = Pacman.Ghost.States.Chase;
}

Pacman.Ghost.prototype.isPlayerVisible = function(player) {
    return false;
    switch (this.tweenDirection.direction) {
        case Phaser.UP:
            this.directionVector = new Phaser.Point(this.tweenDirection.x + 16, this.tweenDirection.y).subtract(this.sprite.body.center.x, this.sprite.body.center.y).normalize();
            break;
        case Phaser.DOWN:
            this.directionVector = new Phaser.Point(this.tweenDirection.x + 16, this.tweenDirection.y).subtract(this.sprite.body.center.x, this.sprite.body.center.y).normalize();
            break;
        case Phaser.LEFT:
            this.directionVector = new Phaser.Point(this.tweenDirection.x, this.tweenDirection.y - 16).subtract(this.sprite.body.center.x, this.sprite.body.center.y).normalize();
            break;
        case Phaser.RIGHT:
            this.directionVector = new Phaser.Point(this.tweenDirection.x, this.tweenDirection.y - 16).subtract(this.sprite.body.center.x, this.sprite.body.center.y).normalize();
            break;
    }

    var distance = Phaser.Math.distance(this.sprite.body.center.x, this.sprite.body.center.y, player.body.center.x, player.body.center.y);


    var inFov = Phaser.extensions.isTargetVisibleXY(this.sprite.body.center.x, this.sprite.body.center.y, this.directionVector, player.body.center.x, player.body.center.y, Pacman.Ghost.Behaviour[this.name].fov);



    var visible = inFov && distance < Pacman.Ghost.Behaviour[this.name].viewDistance;


    if (visible) {
        this.lastTimeISawPlayer = this.game.time.now;
    }

    var iSeeYouTimer = Pacman.Ghost.Behaviour[this.name].iSeeYouTimer * 1000;
    console.log(this.name, this.game.time.now + iSeeYouTimer, " < ", this.lastTimeISawPlayer)

    return visible || this.game.time.now < this.lastTimeISawPlayer + iSeeYouTimer;
};

Pacman.Ghost.prototype.updateLevelStage = function() {
    if (this.activeLevelStageDirty) {
        this.activeLevelStageDirty = false;
        var stage = Pacman.Ghost.Level.One[this.activeLevelStage];
        this.state = stage.State;

        console.log(this.name, "Updated level state", stage.State, stage.Timelimit);

        if (stage.Timelimit > 0) {
            this.currentStageTimer = this.game.time.events.add(Phaser.Timer.SECOND * stage.Timelimit, function() {
                this.activeLevelStageDirty = true;
                this.activeLevelStage++;
            }, this);
        }

    }
};

Pacman.Ghost.prototype._calculateMovement = function() {
    this.moving = false;


    var tile = new Phaser.Point(this.sprite.x / 32, this.sprite.y / 32);
    var surroundingTiles = Pacman.Helpers.Tilemap.getSurroundingTiles(this.tilemap.level, tile.x, tile.y);
    var validDirections = Pacman.Helpers.Tilemap.getValidDirections(this.direction, this.tilemap.passableTiles, surroundingTiles, this.reverse);
    var validTiles = Pacman.Helpers.Tilemap.getValidTilesToMoveTo(validDirections, surroundingTiles);

    if(this.reverse) this.reverse = false;
    
    if (validTiles) {
        this.tweenDirection = Pacman.Ghost.Behaviour[this.name].calculateDirection(validTiles, this.targetPosition);
        this.direction = this.tweenDirection.direction;
    }
    else if (this.sprite.x === 0 && this.direction === Phaser.LEFT) {
        this.tweenDirection = {
            x: this.sprite.x - 32,
            y: this.sprite.y
        };
    }
    else if (this.sprite.x < 0) {
        this.sprite.x = 864 + 32;

        this.tweenDirection = {
            x: this.sprite.x = 864,
            y: this.sprite.y
        };
        this.direction = Phaser.LEFT;
    }
    else if (this.sprite.x === 864 && this.direction === Phaser.RIGHT) {
        this.tweenDirection = {
            x: this.sprite.x + 32,
            y: this.sprite.y
        };
    }
    else if (this.sprite.x > 864) {
        this.sprite.x = -32;
        this.tweenDirection = {
            x: this.sprite.x = 0,
            y: this.sprite.y
        };
        this.direction = Phaser.RIGHT;
    }
    else {
        this.tweenDirection = {
            x: this.sprite.x,
            y: this.sprite.y - 32
        };
        this.direction = Phaser.UP;
    }
};

Pacman.Ghost.Behaviour = {
    "Blinky": { // Red
        active: function(game) { return true; },
        iSeeYouTimer: 5,
        fov: 90,
        maxSpeed: 180,
        viewDistance: 300,
        calculateDirection: _calculateDirection,
        selectTarget: function(playerPosition, playerDirection, homePosition, state, tilemapLevel, ghostPosition, otherGhosts) {
            return new Phaser.Point(playerPosition.x, playerPosition.y);
        }
    },
    "Inky": { // Blue
        active: function(game) { return game.score >= 30; },
        iSeeYouTimer: 5,
        fov: 90,
        maxSpeed: 180,
        viewDistance: 300,
        calculateDirection: _calculateDirection,
        selectTarget: function(playerPosition, playerDirection, homePosition, state, tilemapLevel, ghostPosition, otherGhosts) {
            var red;
            for (var i in otherGhosts) {
                if (otherGhosts[i].name === "Blinky") red = otherGhosts[i];
            }

            var tileInFrontOfPacman = Pacman.Helpers.Tilemap.getTileInfrontOf(playerPosition.x, playerPosition.y, tilemapLevel, playerDirection, 2);

            var tileWorldPos = new Phaser.Point(tileInFrontOfPacman.worldX, tileInFrontOfPacman.worldY);
            var redPosition = red.sprite.position.clone();

            var newTarget = tileWorldPos.subtract(redPosition.x, redPosition.y);
            newTarget.multiply(2, 2);
            newTarget.add(redPosition.x, redPosition.y);


            return newTarget;
        }
    },
    "Clyde": { // Yellow
        active: function(game) { return game.score >= 180 },
        iSeeYouTimer: 5,
        fov: 90,
        maxSpeed: 180,
        viewDistance: 300,
        calculateDirection: _calculateDirection,
        selectTarget: function(playerPosition, playerDirection, homePosition, state, tilemapLevel, ghostPosition, otherGhosts) {
            
            // Distance to the player by tiles
            var distance = playerPosition.clone().subtract(ghostPosition.x, ghostPosition.y).getMagnitude()/32
            
            if(distance > 8)
                return new Phaser.Point(playerPosition.x, playerPosition.y);
            else
                return new Phaser.Point(homePosition.x, homePosition.y);
        }
    },
    "Pinky": { // Pink
        active: function(game) { return true; },
        iSeeYouTimer: 5,
        fov: 90,
        maxSpeed: 180,
        viewDistance: 300,
        calculateDirection: _calculateDirection,
        selectTarget: function(playerPosition, playerDirection, homePosition, state, tilemapLevel, ghostPosition, otherGhosts) {
            var tile = Pacman.Helpers.Tilemap.getTileInfrontOf(playerPosition.x, playerPosition.y, tilemapLevel, playerDirection, 4);
            return new Phaser.Point(tile.worldX, tile.worldY);
        }
    }
};

Pacman.Ghost.States = {
    Scatter: "SCATTER",
    Chase: "CHASE",
    Scared: "SCARED"
};

/*
Scatter for 7 seconds, then Chase for 20 seconds.
Scatter for 7 seconds, then Chase for 20 seconds.
Scatter for 5 seconds, then Chase for 20 seconds.
Scatter for 5 seconds, then switch to Chase mode permanently.
*/
Pacman.Ghost.Level = {
    One: [{
        State: Pacman.Ghost.States.Scatter,
        Timelimit: 1
    }, {
        State: Pacman.Ghost.States.Chase,
        Timelimit: 20
    }, {
        State: Pacman.Ghost.States.Scatter,
        Timelimit: 7
    }, {
        State: Pacman.Ghost.States.Chase,
        Timelimit: 20
    }, {
        State: Pacman.Ghost.States.Scatter,
        Timelimit: 5
    }, {
        State: Pacman.Ghost.States.Chase,
        Timelimit: 20
    }, {
        State: Pacman.Ghost.States.Scatter,
        Timelimit: 5
    }, {
        State: Pacman.Ghost.States.Chase,
        Timelimit: -1
    }]
};


function _calculateDirection(validTiles, target) {

    //var target = player.sprite.position;
    //var target = new Phaser.Point(23*30, 1*32);

    var dist = 999990; // egentligen: widht + height
    var idx = -1;
    for (var i = 0, l = validTiles.length; i < l; i++) {
        var newDist = Math.abs(validTiles[i].tile.worldX - target.x) + Math.abs(validTiles[i].tile.worldY - target.y);

        if (newDist > dist)
            continue;
        dist = newDist;
        idx = i;
    }


    return {
        direction: validTiles[idx].direction,
        x: validTiles[idx].tile.worldX,
        y: validTiles[idx].tile.worldY
    }
    // inte riktigt med på vad du menar :( vet vbara vilket håll jag får gå

    //Phaser.Point.distance(new Phaser.Point(0, 0), new Phaser.Point(10, 10))

    // ogogogog fastre!!!1!! Vad tror du om att istället för att skicka in validDirections skicka in dom tile-indexarna han kan gå till?
    // Sen kan du kolla alla tiles och se vilken som är närmast spelaren. :)
}


Pacman.Ghost.prototype._addRedAnimations = function() {
    this.sprite.animations.add('right', [0, 1], 4, true);
    this.sprite.animations.add('down', [14, 15], 4, true);
    this.sprite.animations.add('left', [28, 29], 4, true);
    this.sprite.animations.add('up', [42, 43], 4, true);
};

Pacman.Ghost.prototype._addYellowAnimations = function() {
    this.sprite.animations.add('right', [2, 3], 4, true);
    this.sprite.animations.add('down', [16, 17], 4, true);
    this.sprite.animations.add('left', [30, 31], 4, true);
    this.sprite.animations.add('up', [44, 45], 4, true);
};

Pacman.Ghost.prototype._addPinkAnimations = function() {
    this.sprite.animations.add('right', [4, 5], 4, true);
    this.sprite.animations.add('down', [18, 19], 4, true);
    this.sprite.animations.add('left', [32, 33], 4, true);
    this.sprite.animations.add('up', [46, 47], 4, true);
};

Pacman.Ghost.prototype._addBlueAnimations = function() {
    this.sprite.animations.add('right', [6, 7], 4, true);
    this.sprite.animations.add('down', [20, 21], 4, true);
    this.sprite.animations.add('left', [34, 35], 4, true);
    this.sprite.animations.add('up', [48, 49], 4, true);
};

Pacman.Ghost.prototype.setTilemap = function(tilemap) {
    this.tilemap = tilemap;
};
