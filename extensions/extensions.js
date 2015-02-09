var Phaser = Phaser || {};

Phaser.extensions = {
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
    isTargetVisible: function(origin, direction, target, fov) {
        fov = fov / 2;

        var normalizedPlayerDirection = Phaser.Point.normalize(direction);
        var directionToTarget = Phaser.Point.subtract(target, origin);
        var normalizedDirectionToTarget = Phaser.Point.normalize(directionToTarget);
        var dotProduct = normalizedPlayerDirection.dot(normalizedDirectionToTarget);
        var cos = Math.cos(Phaser.Math.degToRad(fov));
        return dotProduct > cos
    },

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
    isTargetVisibleXY: function(originX, originY, direction, targetX, targetY, fov) {
        var origin = new Phaser.Point(originX, originY);
        var target = new Phaser.Point(targetX, targetY);

        return this.isTargetVisible(origin, direction, target, fov);
    },

    /**
     * Draw the field of view boundaries
     *
     * @method debugDrawFov
     * @param {Phaser.Point} [origin] - The origin point to draw the fov from
     * @param {Phaser.Point} target - The target to look at
     * @param {number} fov - The Field of View
     * @param {number} [length] - Optional length of the fov-borders, if not supplied the length from origin to target will be used
     */
    debugDrawFov: function(game, origin, target, fov, length) {
        fov = fov / 2;

        if (!length) length = new Phaser.Line(origin.x, origin.y, target.x, target.y).length;

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
    },

    debugDrawFovXY: function(game, originX, originY, targetX, targetY, fov, length) {
        var origin = new Phaser.Point(originX, originY);
        var target = new Phaser.Point(targetX, targetY);

        this.debugDrawFov(game, origin, target, fov, length);
    }
}