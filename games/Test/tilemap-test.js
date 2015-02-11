// http://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099
var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    render: render,
    update: update
});

var cursors, map, layer1, rooms = [];;

function preload() {
    game.load.image('tilesheet', '../pacman/assets/maptiles.png');
}

function create() {
    game.stage.backgroundColor = '#84D455';

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //screen size will be set automatically
    game.scale.setScreenSize(true);

    cursors = game.input.keyboard.createCursorKeys();

    generateBinaryTilemap(40, 40);
    
    
    
    return;

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('tilesheet');


    layer1 = map.create('level1', 40, 40, 32, 32);
    //layer1.scrollFactorX = 0.5;
    //layer1.scrollFactorY = 0.5;

    //  Resize the world
    layer1.resizeWorld();

    var roomSize = {
        min: {
            width: 5,
            height: 5
        },
        max: {
            width: 10,
            height: 10
        }
    };
    
    var maxIterations = 100;
    var maxRooms = 20;
    for (var i = 0, r = 0; r < maxRooms && i < maxIterations; i++) {
        var
            offsetX = game.rnd.integerInRange(2, map.width - roomSize.max.width - 2),
            offsetY = game.rnd.integerInRange(2, map.height - roomSize.max.height - 2),
            width = game.rnd.integerInRange(roomSize.min.width, roomSize.max.width),
            height = game.rnd.integerInRange(roomSize.min.height, roomSize.max.height);

        var room = generateRoom(offsetX, offsetY, width, height, rooms);
        if (room == null) continue;

        if (r > 0) {
            generateHorizontalCorridor(room.centerX, rooms[r - 1].centerX, room.centerY);
            generateVerticalCorridor(rooms[r - 1].centerY, room.centerY, rooms[r - 1].centerX);
        }

        rooms.push(room);
        r++;
    }

    console.log("Rooms: ", r);

    // map.forEach(function(tile) {
    //     debugger;
    //     var tileAbove = map.getTileAbove(map.layer1, tile.x, tile.y);
    //     if(tileAbove) { 
    //         debugger;
    //     }
    // }, 0, 0, map.width, map.height, map.layer1);

}

function generateBinaryTilemap(width, height) {
    var tilemap = Array.apply(null, new Array(width * height)).map(Number.prototype.valueOf,0);
    debugger;
    generateRoom(0, 0, 10, 10, [], tilemap, width);
    
}

function getIndex(x, y, width) {
    return x * width + y;
}

function generateRoom(offsetX, offsetY, width, height, rooms, tilemap, tilemapWidth) {
    var room = new Room(offsetX, offsetY, width, height);

    for (var i in rooms) {
        if (room.intersects(rooms[i])) return null;
    }
    var tileIndex = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            tilemap[getIndex(x, y, tilemapWidth)] = 1;
        }
    }

    return room;
}

function generateHorizontalCorridor(startX, endX, y) {
    var sx = Phaser.Math.min(startX, endX);
    var ex = Phaser.Math.max(startX, endX);
    for (var x = sx; x <= ex; x++) {
        map.putTile(11, x, y);
    }
}

function generateVerticalCorridor(startY, endY, x) {
    var sy = Phaser.Math.min(startY, endY);
    var ey = Phaser.Math.max(startY, endY);
    for (var y = sy; y <= ey; y++) {
        map.putTile(11, x, y);
    }
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
    
    var pointer = game.input.activePointer.position;
    
    var tile = map.getTileWorldXY(pointer.x, pointer.y, 32, 32, layer1);
    
    if(tile) {
        game.debug.text("Tile " + tile.index + " [" + tile.x + ", " + tile.y + "]", pointer.x, pointer.y)
    }
    
    game.debug.text("Arrowkeys", 32, 32, 'rgba(0,0,0,1)');
}


var Room = function(x, y, width, height) {
    this.setTo(x, y, width, height);
};

Room.prototype = Object.create(Phaser.Rectangle.prototype);
Room.prototype.constructor = Room;
