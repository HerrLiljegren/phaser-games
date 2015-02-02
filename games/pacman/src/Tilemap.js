'use strict';
var Tilemap = function (game) {
    this.game = game;
    this.game.stage.backgroundColor = '#000';
    this.map = this.game.add.tilemap('pacman-level');
    this.map.addTilesetImage('maptiles', 'maptiles');

    this.level = this.map.createLayer('Level');
    this.pills = this.map.createLayer('Pills');



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

    this.map.setTileIndexCallback(30, function(sprite, tile) {
        tile.index = -1;
        this.pills.dirty = true;
        this.game.score++;
        return false;

    }, this, this.pills);

    //this.level.debug = true;
}