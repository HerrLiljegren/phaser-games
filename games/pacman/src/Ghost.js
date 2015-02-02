'use strict';
Pacman.Ghost = function(game, index) {
    this.game = game;

    this.sprite = this.game.add.sprite(32 * 13, 32 * 11, 'sprites');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.frame = 0;

    switch(index) {
        case 0:
            this._addRedAnimations();
            break;
            
        case 1:
            this._addYellowAnimations();
            break;
            
        case 2:
            this._addPinkAnimations();
            break;
            
        case 3:
            this._addBlueAnimations();
            break;
    }
    
    
    this.maxSpeed = 150;

    //this.sprite.body.velocity.x = this.maxSpeed;
    this.sprite.animations.play('right');
}

Pacman.Ghost.prototype.update = function() {
    
}

Pacman.Ghost.prototype._addRedAnimations = function() {
    this.sprite.animations.add('right', [0, 1], 4, true);
    this.sprite.animations.add('down', [14, 15], 4, true);
    this.sprite.animations.add('left', [28, 29], 4, true);
    this.sprite.animations.add('up', [32, 33], 4, true);
    
    this.sprite.position.set(32 * 13, 32 * 13);
}

Pacman.Ghost.prototype._addYellowAnimations = function() {
    this.sprite.animations.add('right', [2, 3], 4, true);
    this.sprite.animations.add('down', [16, 17], 4, true);
    this.sprite.animations.add('left', [30, 31], 4, true);
    this.sprite.animations.add('up', [34, 35], 4, true);
    
    this.sprite.position.set(32 * 14, 32 * 13);
}

Pacman.Ghost.prototype._addPinkAnimations = function() {
    this.sprite.animations.add('right', [4, 5], 4, true);
    this.sprite.animations.add('down', [18, 19], 4, true);
    this.sprite.animations.add('left', [32, 33], 4, true);
    this.sprite.animations.add('up', [36, 37], 4, true);   
    
    this.sprite.position.set(32 * 13, 32 * 14);
}

Pacman.Ghost.prototype._addBlueAnimations = function() {
    this.sprite.animations.add('right', [6, 7], 4, true);
    this.sprite.animations.add('down', [20, 21], 4, true);
    this.sprite.animations.add('left', [34, 35], 4, true);
    this.sprite.animations.add('up', [38, 39], 4, true);   
    
    this.sprite.position.set(32 * 14, 32 * 14);
}
