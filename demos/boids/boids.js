/* global Machine: true, Phaser: true, TilemapGenerator: true */

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var MAX_BOIDS = 20;
var boids = null;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.spritesheet('soldier', '../../games/machine/assets/soldier.png', 16, 16);

}

function create() {

    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    
    game.stage.backgroundColor = '#222222';
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    //screen size will be set automatically
    game.scale.setScreenSize(true);
        
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    boids = game.add.group();
    for(var i = 0; i < MAX_BOIDS; i++) {
        
        var boid = boids.create(game.world.randomX, game.world.randomY, 'soldier');
        game.physics.arcade.enableBody(boid);
    }
}

function update() {
    var target = game.input.activePointer.position;
    var velocity1 = new Phaser.Point();
    var velocity2 = new Phaser.Point();
    var velocity3 = new Phaser.Point();
    
    boids.forEach(function(boid) {
        
        velocity1 = rule1(boids, boid);
        velocity2 = rule2(boids, boid);
        velocity3 = rule3(boids, boid);
        var v = Phaser.Point.add(velocity1, velocity2);
        v = Phaser.Point.add(velocity3, v);
        boid.body.velocity.setTo(v.x, v.y);
    });
}

// Rule 1: Boids try to fly towards the centre of mass of neighbouring boids.
function rule1(boids, boid) {
    var p = new Phaser.Point();
    
    boids.forEach(function(b) {
        if(b !== boid) {
            p.add(boid.x, boid.y);
        }
    });
    
    p.x = p.x / boids.length - 1;
    p.y = p.y / boids.length - 1;
    
    p.subtract(boid.x, boid.y);
    
    p.x /= 1;
    p.y /= 1;
    
    return p;
}

function rule2(boids, boid) {
    var p = new Phaser.Point();
    return p;
}

function rule3(boids, boid) {
    var p = new Phaser.Point();
    return p;
}