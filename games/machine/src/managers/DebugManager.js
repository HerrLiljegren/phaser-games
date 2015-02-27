/* global Machine: true, Phaser: true, TilemapGenerator: true */
'use strict';

Machine.DebugManager = (function() {
    var pixels = [];
    
    return {
        drawPixels: function() {
            for(var i in pixels) {
                if(typeof(pixels[i]) === 'function') {
                    pixels[i]();
                }
            }
        },
        
        addPixel: function(game, key, point) {
            
            pixels[key] = function() {
                game.debug.pixel(point.x, point.y, 'rgba(0, 255, 0, 255);', 4);
            }
            
        }
    }
})();