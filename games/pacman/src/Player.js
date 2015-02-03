'use strict';
Pacman.Player = function(game) {
    this.game = game;
    this.startX = 32 * 13;
    this.startY = 32 * 17;
    this.sprite = this.game.add.sprite(this.startX, this.startY, 'sprites');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.frame = 10;

    this.sprite.animations.add('right', [10, 11], 4, true);
    this.sprite.animations.add('down', [24, 25], 4, true);
    this.sprite.animations.add('left', [38, 39], 4, true);
    this.sprite.animations.add('up', [52, 53], 4, true);

    this.maxSpeed = 150;
    this.isSuper = false;
    this.superTime = 10;

    this.sprite.body.velocity.x = this.maxSpeed;
    this.sprite.animations.play('right');
    
}

Pacman.Player.prototype.update = function () {
    if (this.game.gameOver) return;
    
    if(this.isSuper) { this.maxSpeed = 300; } else {this.maxSpeed = 150;}
    
    if (this.game.movementKeys.left.isDown) {
        this.sprite.body.velocity.x = -this.maxSpeed;
        this.sprite.animations.play('left');
    }
    else if (this.game.movementKeys.right.isDown) {
        this.sprite.body.velocity.x = this.maxSpeed;
        this.sprite.animations.play('right');
    }
    
    if (this.game.movementKeys.up.isDown) {
        this.sprite.body.velocity.y = -this.maxSpeed;
        this.sprite.animations.play('up');
    }
    else if (this.game.movementKeys.down.isDown) {
        this.sprite.body.velocity.y = this.maxSpeed;
        this.sprite.animations.play('down');
    }
    
    if (!this.game.movementKeys.left.isDown && !this.game.movementKeys.right.isDown && !this.game.movementKeys.up.isDown && !this.game.movementKeys.down.isDown) {
        //  Stand still
        //player.sprite.animations.stop();
        //player.frame = 4;
    }
    
    if(this.sprite.position.x < -32)
        this.sprite.position.x = 896+32;
    
    if(this.sprite.position.x > 896+32) {
            this.sprite.position.x = -32;
    }
        
}

Pacman.Player.prototype.die = function(a, b, c) {
    
    if (!this.game.gameOver && --this.game.lives < 1) {
        this.game.gameOver = true;
    } else {
        this.sprite.position.set(this.startX, this.startY);
    };
}

Pacman.Player.prototype.makeSuper = function(){
    this.isSuper = true;
    this.game.time.events.add(Phaser.Timer.SECOND * this.superTime, function(){this.isSuper = false;}, this);
}
