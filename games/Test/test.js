var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { render:render, update: update  });


//var player = new Phaser.Point(400, 300);
var pointer = new Phaser.Point();
var player = new Phaser.Rectangle(400, 300, 32, 32);
var enemy = new Phaser.Rectangle(200, 150, 32, 32);

var angle;
var visible = false;

/**
 * Check if a target is inside the field of view of the origin
 *
 * @method isTargetVisible
 * @param {Phaser.Point} origin - The origin point to calculate the visability cone from
 * @param {Phaser.Point} direction - The direction the origin is looking
 * @param {Phaser.Point} target - The target to check if visible within the fov
 * @param {number} fov - The Field of View
 * @return {boolean} If target is visible inside origin's field of view
 */
function isTargetVisible(origin, direction, target, fov){
    fov = fov / 2;
    
    var normalizedPlayerDirection = Phaser.Point.normalize(direction);
    var directionToTarget = Phaser.Point.subtract(target, origin);
    var normalizedDirectionToTarget = Phaser.Point.normalize(directionToTarget);
    var dotProduct = normalizedPlayerDirection.dot(normalizedDirectionToTarget);
    var cos = Math.cos(Phaser.Math.degToRad(fov));
    return dotProduct > cos
}

/**
 * Check if a target is inside the field of view of the origin
 *
 * @method isTargetVisibleXY
 * @param {number} originX - The origin X to calculate the visability cone from
 * @param {number} originY - The origin Y to calculate the visability cone from
 * @param {Phaser.Point} direction - The direction the origin is looking
 * @param {number} targetX - The target X to check if visible within the fov
 * @param {number} targetY - The target Y to check if visible within the fov
 * @param {number} fov - The Field of View
 * @return {boolean} If target is visible inside origin's field of view
 */
function isTargetVisibleXY(originX, originY, direction, targetX, targetY, fov){
    var origin = new Phaser.Point(originX, originY);
    var target = new Phaser.Point(targetX, targetY);
    
    return isTargetVisible(origin, direction, target, fov);
}


/**
 * Draw the field of view boundaries
 *
 * @method debugDrawFov
 * @param {Phaser.Point} [origin] - The origin point to draw the fov from
 * @param {Phaser.Point} target - The target to look at
 * @param {number} fov - The Field of View
 * @param {number} [length] - Optional length of the fov-borders, if not supplied the length from origin to target will be used
 */
function debugDrawFov(origin, target, fov, length){
    fov = fov / 2;
    
    if(!length) length = new Phaser.Line(origin.x, origin.y, target.x, target.y).length;
    
    var line = new Phaser.Line(origin.x, origin.y, target.x, target.y);
    var endA = new Phaser.Point(target.x, target.y);
    var endB = new Phaser.Point(target.x, target.y);
    
    
    endA.rotate(origin.x, origin.y, fov, true, length);
    endB.rotate(origin.x, origin.y, -fov, true, length);
    
    var lineA = new Phaser.Line(origin.x, origin.y, endA.x, endA.y);
    var lineB = new Phaser.Line(origin.x, origin.y, endB.x, endB.y);
    
    
    game.debug.geom(line, 'rgba(0,255,0,1');
    game.debug.geom(lineA, 'rgba(255,0,255,1');
    game.debug.geom(lineB, 'rgba(0,255,255,1');
}

function debugDrawFovXY(originX, originY, targetX, targetY, fov, length){
    var origin = new Phaser.Point(originX, originY);
    var target = new Phaser.Point(targetX, targetY);
    
    debugDrawFov(origin, target, fov, length);
}

function update() {
    pointer.x = game.input.activePointer.x;
    pointer.y = game.input.activePointer.y;
    
    var direction = Phaser.Point.subtract(pointer, new Phaser.Point(player.x+16, player.y+16));
    visible = isTargetVisibleXY(player.x+16, player.y+16, direction, enemy.x+16, enemy.y+16, 90);
    
    angle = Phaser.Math.angleBetweenPoints(player, pointer);
}

function render() {

    // Draw debug tools

    debugDrawFovXY(player.x+16, player.y+16, pointer.x, pointer.y, 90);
    
    game.debug.geom(player, 'rgba(0,255,0,1)' ) ;
    game.debug.geom(enemy, 'rgba(255,0,0,1)' ) ;
    //game.debug.geom(target, 'rgba(255,0,0,1)' ) ;
    
    
    
    game.debug.text( Phaser.Math.radToDeg(angle), 100, 400 );
    game.debug.text( visible, 100, 380 );
    game.debug.text()


}