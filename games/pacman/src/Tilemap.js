'use strict';
Pacman.Tilemap = function (game, player) {
    this.game = game;
    this.player = player;
    this.game.stage.backgroundColor = '#000';
    this.map = this.game.add.tilemap('pacman-level');
    this.map.addTilesetImage('maptiles', 'maptiles');

    this.level = this.map.createLayer('Level');
    this.pills = this.map.createLayer('Pills');
    
    var t = this.map.objects['Metadata'];


    //this.layer2 = this.map.createLayer('Level2');

    //this.ground.scale.set(2, 2);
    //this.trees.scale.set(2, 2);
    //this.ground.resizeWorld();
    //this.trees.resizeWorld();
    ////this.layer2.resizeWorld();
    ////this.layer.debug = true;
    //this.trees.debug = true;

    //this.map.setCollisionByExclusion([170,229, 193, 194], this.layer);
    this.map.setCollisionByExclusion([28,29,30], true, this.level);

    this.map.setTileIndexCallback([28, 30], function(sprite, tile) {
        if(Math.abs(sprite.x - tile.worldX) < (tile.width * 0.5) && Math.abs(sprite.y - tile.worldY) < (tile.height * 0.5)) {
            
            if(tile.index == 28) {
                this.player.makeSuper();
            }
            
            tile.index = -1;
            this.pills.dirty = true;
            this.game.score++;
            
            this.game.soundEatFruit.play();
            return false;
        }

    }, this, this.pills);

    //this.level.debug = true;
}