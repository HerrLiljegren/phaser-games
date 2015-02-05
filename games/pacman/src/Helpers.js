'use strict';
Pacman.Helpers = {
    Tilemap: {
        getSurroundingTiles: function(tilemap, x, y, layer) {
            var layerIndex = tilemap.getLayer(layer);
            return {
                up: tilemap.getTileAbove(layerIndex, x, y),
                down: tilemap.getTileBelow(layerIndex, x, y),
                right: tilemap.getTileRight(layerIndex, x, y),
                left: tilemap.getTileLeft(layerIndex, x, y)
            };
        }
    }
};