// http://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099
var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    render: render,
    update: update
});

var cursors, map, layer1, rooms = [], csv, tilemapGenerator;

function preload() {
    tilemapGenerator = new TilemapGenerator();
    tilemapGenerator.create(40*3,40*3,32,32);
    
    
    game.load.tilemap('map', null, tilemapGenerator.csv, Phaser.Tilemap.CSV);
    game.load.image('tilesheet', 'tilemapStructure2.png');
}

function create() {
    game.stage.backgroundColor = '#8ADA55';

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //screen size will be set automatically
    game.scale.setScreenSize(true);

    cursors = game.input.keyboard.createCursorKeys();

    
    
    
    map = game.add.tilemap('map', 32, 32);
    map.addTilesetImage('tilesheet');
    layer1 = map.createLayer(0);
    layer1.resizeWorld();
    
    
    
    
   

    // map.forEach(function(tile) {
    //     debugger;
    //     var tileAbove = map.getTileAbove(map.layer1, tile.x, tile.y);
    //     if(tileAbove) { 
    //         debugger;
    //     }
    // }, 0, 0, map.width, map.height, map.layer1);

}







function update() {
    if (cursors.left.isDown) {
        game.camera.x -= 32;
    }
    else if (cursors.right.isDown) {
        game.camera.x += 32;
    }

    if (cursors.up.isDown) {
        game.camera.y -= 32;
    }
    else if (cursors.down.isDown) {
        game.camera.y += 32;
    }

}

function render() {
    // for(var y = 0; y < map.height; y++){
    //     for(var x = 0; x < map.width; x++) {
    //         game.debug.text(x + "," + y, x*32, y*32+16);
    //     }
    // }
    
    /*var pointer = game.input.activePointer.position;
    
    var tile = map.getTileWorldXY(pointer.x, pointer.y, 32, 32, layer1);
    
    if(tile) {
        game.debug.text("Tile " + tile.index + " [" + tile.x + ", " + tile.y + "]", pointer.x, pointer.y)
    }*/
    
    game.debug.text("Arrowkeys", 32, game.world.height+32, 'rgba(0,0,0,1)');
}


var Room = function(x, y, width, height) {
    this.setTo(x, y, width, height);
};

Room.prototype = Object.create(Phaser.Rectangle.prototype);
Room.prototype.constructor = Room;
