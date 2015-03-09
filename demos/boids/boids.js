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
        boid.velocity = new Phaser.Point();
        //game.physics.arcade.enable(boid);
    }
}

function update() {
    
    var velocity1 = new Phaser.Point();
    var velocity2 = new Phaser.Point();
    var velocity3 = new Phaser.Point();
    
    boids.forEach(function(boid) {
        var target = game.input.activePointer.position.clone();
        
        velocity1 = rule1(boids, boid);
        velocity2 = rule2(boids, boid);
        velocity3 = rule3(boids, boid);
        var v = Phaser.Point.add(velocity1, velocity2);
        v = Phaser.Point.add(velocity3, v);
        var d = target.subtract(boid.x, boid.y).normalize();
        
        
        v.add(d.x, d.y).normalize();
        
        boid.x += v.x;
        boid.y += v.y;
        boid.rotation = Math.atan2(d.y, d.x);
        
    });
}

// Rule 1: Boids try to fly towards the centre of mass of neighbouring boids.
function rule1(boids, boid) {
    var p = new Phaser.Point();
    
    boids.forEach(function(b) {
        if(b !== boid) {
            p.add(b.x, b.y);
        }
    });
    p.divide(boids.length - 1, boids.length - 1)
        .subtract(boid.x, boid.y)
        .divide(400, 400);
    
    return p;
}

// Rule 2: Boids try to keep a small distance away from other objects (including other boids).
function rule2(boids, boid) {
    var p = new Phaser.Point();
    
    boids.forEach(function(b) {
        if(b !== boid) {
            //var length = b.position.clone().subtract(boid.x, boid.y).getMagnitude();
            var distance = Phaser.Math.distance(b.x, b.y, boid.x, boid.y);
            
            if(distance < 32) {
                p.x -= (b.x - boid.x);
                p.y -= (b.y - boid.y);
            }
            
            if(distance < 16) {
                console.log("ok");
            }
        }
    });
    
    return p;
}

// Rule 3: Boids try to match velocity with near boids.
function rule3(boids, boid) {
    var p = new Phaser.Point();
    return p;
    boids.forEach(function(b) {
        if(b !== boid) {
            p.add(b.velocity.x, b.velocity.y);
        }
    });
    
    p.divide(boids.length - 1, boids.length - 1)
        .subtract(boid.velocity.x, boid.velocity.y)
        .divide(8, 8);
    
    return p;
}