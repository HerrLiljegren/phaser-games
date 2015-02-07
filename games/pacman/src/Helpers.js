'use strict';
Pacman.Helpers = {
    Tilemap: {
        /**
         * Gets tiles surrounding the given tile-coordinates
         *
         * @method Pacman.Helpers.Tilemap.getSurroundingTiles
         * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to get the tile from.
         * @param {number} x - The x coordinate to get the tile from. In tiles, not pixels.
         * @param {number} y - The y coordinate to get the tile from. In tiles, not pixels.
         * @return {object} All surrounding tiles.
         */
        getSurroundingTiles: function(layer, x, y) {
            var tilemap = layer.map;
            var layerIndex = tilemap.getLayer(layer);
            
            return {
                up: tilemap.getTileAbove(layerIndex, x, y),
                down: tilemap.getTileBelow(layerIndex, x, y),
                right: tilemap.getTileRight(layerIndex, x, y),
                left: tilemap.getTileLeft(layerIndex, x, y)
            };
        },

        getValidDirections: function(direction, passableTiles, surroundingTiles) {
            return {
                canMoveUp: direction !== Phaser.DOWN && surroundingTiles.up && passableTiles.indexOf(surroundingTiles.up.index) > -1,
                canMoveDown: direction !== Phaser.UP && surroundingTiles.down && passableTiles.indexOf(surroundingTiles.down.index) > -1,
                canMoveLeft: direction !== Phaser.RIGHT && surroundingTiles.left && passableTiles.indexOf(surroundingTiles.left.index) > -1,
                canMoveRight: direction !== Phaser.LEFT && surroundingTiles.right && passableTiles.indexOf(surroundingTiles.right.index) > -1
            };
        },
        
        getValidTilesToMoveTo: function(validDirections, surroundingTiles) {
            var validTiles = []
                if (validDirections.canMoveUp) {
                    validTiles.push({
                        tile: surroundingTiles.up,
                        direction: Phaser.UP
                    });
                }
                if (validDirections.canMoveDown) {
                    validTiles.push({
                        tile: surroundingTiles.down,
                        direction: Phaser.DOWN
                    });
                }
                if (validDirections.canMoveLeft) {
                    validTiles.push({
                        tile: surroundingTiles.left,
                        direction: Phaser.LEFT
                    });
                }
                if (validDirections.canMoveRight) {
                    validTiles.push({
                        tile: surroundingTiles.right,
                        direction: Phaser.RIGHT
                    });
                }
                
                return validTiles.length > 0 ? validTiles : null;
        }
    }
};