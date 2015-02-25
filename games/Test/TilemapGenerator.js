var TilemapGenerator = function() {
    this.width = 0;
    this.height = 0;
    this.tileWidth = 0;
    this.tileHeight = 0;
    this.rooms = [];
    this.csv = "";

    this.floorTileIndex = 0;
    this.wallTileIndex = 18;

    this.options = {
        width: 120,
        height: 120,
        tileWidth: 32,
        tileHeight: 32,
        emptyTileIndex: 15,
        maxIterations: 100,
        maxRooms: 1,
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
    }

    this.tilemap = null;
};

TilemapGenerator.prototype = {
    create: function(width, height, tileWidth, tileHeight, options) {
        this.extend(this.options, options);
        
        this.width = width || this.options.width;
        this.height = height || this.options.height;
        this.tileWidth = tileWidth || this.options.tileWidth;
        this.tileHeight = tileHeight || this.options.tileHeight;
        this.rooms = [];
        this.csv = "";
        
        
        
        this.tilemap = Array.apply(null, new Array(this.width * this.height)).map(Number.prototype.valueOf, this.options.emptyTileIndex);

        this._generateBinaryTilemap();
        this._placeWalls();
        
        this._generateCsv();
    },

    _randomIntFromInterval: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    
    extend: function() {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    },
    _generateBinaryTilemap: function() {
        for (var i = 0, r = 0; r < this.options.maxRooms && i < this.options.maxIterations; i++) {
            var
                offsetX = this._randomIntFromInterval(2, this.width - this.options.roomSize.max.width - 2),
                offsetY = this._randomIntFromInterval(2, this.height - this.options.roomSize.max.height - 2),
                roomWidth = this._randomIntFromInterval(this.options.roomSize.min.width, this.options.roomSize.max.width),
                roomHeight = this._randomIntFromInterval(this.options.roomSize.min.height, this.options.roomSize.max.height);

            var room = this._generateRoom(offsetX, offsetY, roomWidth, roomHeight);
            if (room == null) continue;

            if (r > 0) {
                this._generateHorizontalCorridor(room.centerX, this.rooms[r - 1].centerX, room.centerY);
                this._generateVerticalCorridor(this.rooms[r - 1].centerY, room.centerY, this.rooms[r - 1].centerX);
            }

            this.rooms.push(room);
            r++;
        }
    },

    _generateCsv: function() {
        var csv = "";
        for (var i = 0; i < this.height; i++) {
            var slice = this.tilemap.slice(i * this.height, this.width * (i + 1));
            csv += slice.join() + '\n';
        }
        this.csv = csv;
    },

    _generateRoom: function(offsetX, offsetY, width, height) {
        var room = new Machine.Room(offsetX-1, offsetY-1, width+2, height+2);

        for (var i in this.rooms) {
            if (room.intersects(this.rooms[i])) return null;
        }
        var tileIndex = 0;
        for (var y = 0; y < room.height; y++) {
            for (var x = 0; x < room.width; x++) {
                this.setTileIndex(x + room.x, y + room.y, this.floorTileIndex);
            }
        }

        return room;
    },

    _generateHorizontalCorridor: function(startX, endX, y) {
        var sx = Math.min(startX, endX);
        var ex = Math.max(startX, endX);
        for (var x = sx; x <= ex; x++) {
            this.setTileIndex(x, y+1, this.floorTileIndex);
            this.setTileIndex(x, y-1, this.floorTileIndex);
            this.setTileIndex(x, y+2, this.floorTileIndex);
            this.setTileIndex(x, y-2, this.floorTileIndex);
            this.setTileIndex(x, y, this.floorTileIndex);
        }
    },

    _generateVerticalCorridor: function(startY, endY, x) {
        var sy = Math.min(startY, endY);
        var ey = Math.max(startY, endY);
        for (var y = sy; y <= ey; y++) {
            this.setTileIndex(x+1, y, this.floorTileIndex);
            this.setTileIndex(x-1, y, this.floorTileIndex);
            this.setTileIndex(x+2, y, this.floorTileIndex);
            this.setTileIndex(x-2, y, this.floorTileIndex);
            this.setTileIndex(x, y, this.floorTileIndex);
        }
    },
    
    _placeWalls: function() {
        
        var NORTH = 1, EAST = 2, SOUTH = 4, WEST = 8,
        NORTH_WEST = 16;
        
        for(var i = 0; i < this.width * this.height; i++) {
            var y = Math.floor(i / this.width);
            var x = Math.floor(i - (y * this.height));
            
            var currentTileIndex = this.getTileIndex(x, y);
            var surroundingTileIndex = this.getSurroundingTileIndex(x, y);
            var newTileIndex = 0;
            
            if(currentTileIndex == this.options.emptyTileIndex) continue;
            
            var hasNeighbourNorth = surroundingTileIndex.north === this.options.emptyTileIndex;
            var hasNeighbourEast = surroundingTileIndex.east === this.options.emptyTileIndex;
            var hasNeighbourSouth = surroundingTileIndex.south === this.options.emptyTileIndex;
            var hasNeighbourWest = surroundingTileIndex.west === this.options.emptyTileIndex;
            
            newTileIndex = ((hasNeighbourNorth ? NORTH : 0) | (hasNeighbourEast ? EAST : 0) | (hasNeighbourSouth ? SOUTH : 0) | (hasNeighbourWest ? WEST : 0));
            
            this.setTileIndex(x, y, newTileIndex);
        }
        
        var tile = this._getIndexAbove(0, 0)
    },

    setTileIndex: function(x, y, tileIndex) {
        this.tilemap[this._getIndex(x, y, this.width)] = tileIndex;
    },
    
    getTileIndex: function(x, y) {
        var index = this._getIndex(x, y, this.width);
        return (index == null) ? index : this.tilemap[index];
    },
    
    _getIndex: function(x, y) {
        var index = y * this.width + x;
        return (index >= 0  && index < this.height * this.width) ?  index : null;
    },
    
    _getIndexAbove: function(x, y) {
        return this._getIndex(x, y-1, this.width);
    },
    
    _getIndexBelow: function(x, y) {
        return this._getIndex(x, y+1, this.width);
    },
    
    _getIndexLeft: function(x, y) {
        return this._getIndex(x-1, y, this.width);
    },
    
    _getIndexRight: function(x, y) {
        return this._getIndex(x+1, y, this.width);
    },
    
    getSurroundingTileIndex: function(x, y) {
        var data = {
            north: this.getTileIndex(x, y-1),
            northEast: this.getTileIndex(x+1, y-1),
            east: this.getTileIndex(x+1, y),
            shouthEast: this.getTileIndex(x+1, y+1),
            south: this.getTileIndex(x, y+1),
            soutWest: this.getTileIndex(x-1, y+1),
            west: this.getTileIndex(x-1, y),
            northWest: this.getTileIndex(x-1, y+1),
        }
        
        return data;
    }
};