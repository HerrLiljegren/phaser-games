'use strict';
var game = new Phaser.Game(896, 992, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});


function preload() {
    game.load.spritesheet('sprites', 'assets/sprites.png', 32, 32, 14 * 4, 0, 0);
    game.load.tilemap('pacman-level', 'assets/pacman-level.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('maptiles', 'assets/maptiles.png');
}

var tilemap, player, movementKeys, text, ghost;

function create() {
    game.score = 0;
    game.lives = 3;
    game.gameOver = false;
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.world.setBounds(-0, 0, 800, 600);
    
    tilemap = new Tilemap(game);
    
    // The player and its settings
    player = new Player(game);
    ghost = new Ghost(game);
    

    movementKeys = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    }

    text = game.add.text(32, 32*10, getScoreBoardText(game, tilemap), {
        font: "14px Arial",
        fill: "#FFFFFF",
        align: "left"
    });
    
    //text.anchor.setTo(0.5, 0.5);
}

function update(a, b, c) {
    //  Collide the player and the stars with the platforms
    //game.physics.arcade.collide(player.sprite, platforms);
    //game.physics.arcade.collide(stars, platforms);
    //game.physics.arcade.collide(stars, player.bullets);
    //game.physics.arcade.overlap(player.sprite, stars, collectStar, null, this);
    //game.physics.arcade.overlap(player.bullets, platforms, bulletHitPlatform, null, this);
    //game.physics.arcade.collide(player.sprite, tilemap.trees);
    game.physics.arcade.collide(player.sprite, tilemap.level);
    game.physics.arcade.overlap(player.sprite, tilemap.pills);
    game.physics.arcade.collide(ghost.sprite, tilemap.level);
    game.physics.arcade.overlap(ghost.sprite, player.sprite, player.die, null, player);
    

    //  Reset the players velocity (movement)
    //player.sprite.body.velocity.x = 0;
    //player.sprite.body.velocity.y = 0;
    
    
    
    if (game.input.activePointer.isDown) {
        //player.fire();
    }

    //  Allow the player to jump if they are touching the ground.
    //if (cursors.up.isDown && player.sprite.body.touching.down)
    //{
    //    player.sprite.body.velocity.y = -350;
    //}

    player.update();
    ghost.update();
    text.setText(getScoreBoardText(game, tilemap));

    if (game.gameOver) {
        console.log("GAME OVER!");
    }

}

function render() {
    //player.render();
}

function getScoreBoardText(game, tilemap) {
    var minutes = Math.floor(game.time.totalElapsedSeconds() / 60);
    var seconds = (game.time.totalElapsedSeconds() - minutes * 60).toFixed(3);
    return "- Pills: " + game.score + "\n- Lives: "+ game.lives + "\n- Time: " + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
}