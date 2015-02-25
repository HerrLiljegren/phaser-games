/* global Machine: true, Phaser: true, TilemapGenerator: true */
'use strict';

Machine.LevelManager = (function() {
    var _tilemapGenerator = new TilemapGenerator();
    var _spawn = new Phaser.Point();
    var _game = null;
    var _level = null;
    var _layer = null;
    var _tileBodies = [];
    
    return {
        spawn: _spawn,
        
        preload: function(game) {
            _game = game;
            
            _tilemapGenerator.create(40*6,40*6,32,32, {
                maxRooms: 10,
                roomSize: {
                    min: {
                        width: 10,
                        height: 10
                    },
                    max: {
                        width: 20,
                        height: 20
                    }
                }
            });
    
            _game.load.tilemap('map', null, _tilemapGenerator.csv, Phaser.Tilemap.CSV);
            _game.load.image('tilesheet', '../Test/tilemapStructure2.png');
            
            _spawn.setTo(_tilemapGenerator.rooms[0].centerX * 32, _tilemapGenerator.rooms[0].centerY * 32);
        },
        
        create: function() {
            _level = _game.add.tilemap('map', 32, 32);
            _level.addTilesetImage('tilesheet');
            _layer = _level.createLayer(0);
            _layer.resizeWorld();
            
            //_level.setCollisionByExclusion([0], true, _layer, true);
            
            //  Set the tiles for collision.
            //  Do this BEFORE generating the p2 bodies below.
            _level.setCollisionBetween(15,15);
    
            //_layer.debug = true;
            
            //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
            //  This call returns an array of body objects which you can perform addition actions on if
            //  required. There is also a parameter to control optimising the map build.
            //_tileBodies = _game.physics.p2.convertTilemap(_level, _layer);
            
            //  By default the ship will collide with the World bounds,
            //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
            //  you need to rebuild the physics world boundary as well. The following
            //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
            //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
            //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
            //_game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        },
        
        update: function(player) {
            _game.physics.arcade.collide(player, _layer, function(player, tile) {
                return true;
            }, function(player, tile) {
                return true;
                
                /*var collides = false;
                
                if(tile.index === 1) { // Top-tile
                
                    var color;
                    
                    if(tile.worldY + 8 > player.body.y) {
                        color = "rgba(255,0,0,255);";
                        collides = true;
                        player.body.velocity.y = 0;
                        player.body.newVelocity.y = 0;
                        player.body.blocked.up  = true;
                    } else {
                        color = "rgba(0,0,255,255);";
                        collides = false;
                    }
                    _game.debug.geom(new Phaser.Rectangle(tile.worldX, tile.worldY, 32, 8), 'rgba(255, 0, 0, 255);');
                    _game.debug.geom(new Phaser.Rectangle(player.body.x, player.body.y, 64, 64), color);
                    
                } else if(tile.index !== 0) {
                    collides = true;
                }
                
                return collides;*/
            });
        }
    };
})();
