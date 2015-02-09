var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { render:render, update: update  });


//var player = new Phaser.Point(400, 300);
var pointer = new Phaser.Point();
var player = new Phaser.Rectangle(400, 300, 32, 32);
var enemy = new Phaser.Rectangle(200, 150, 32, 32);

var angle;
var visible = false;



function update() {
    pointer.x = game.input.activePointer.x;
    pointer.y = game.input.activePointer.y;

    var direction = Phaser.Point.subtract(pointer, new Phaser.Point(player.x+16, player.y+16));
    visible = Phaser.extensions.isTargetVisibleXY(player.x+16, player.y+16, direction, enemy.x+16, enemy.y+16, 90);

    angle = Phaser.Math.angleBetweenPoints(player, pointer);
}

function render() {

    // Draw debug tools

    Phaser.extensions.debugDrawFovXY(player.x+16, player.y+16, pointer.x, pointer.y, 90);

    game.debug.geom(player, 'rgba(0,255,0,1)' ) ;
    game.debug.geom(enemy, 'rgba(255,0,0,1)' ) ;
    //game.debug.geom(target, 'rgba(255,0,0,1)' ) ;



    game.debug.text( Phaser.Math.radToDeg(angle), 100, 400 );
    game.debug.text( visible, 100, 380 );
    game.debug.text()


}