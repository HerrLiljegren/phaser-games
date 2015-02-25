/* global Machine: true, Phaser: true */
'use strict';


Machine.Room = function(x, y, width, height) {
    this.setTo(x, y, width, height);
};

Machine.Room.prototype = Object.create(Phaser.Rectangle.prototype);
Machine.Room.prototype.constructor = Machine.Room;