/*jshint Phaser: true*/
'use strict';
var Pacman = Pacman || {};

Pacman.Main = function(game) {
    this.game = game,
        this.tilemap = null,
        this.player = null,
        this.text = "",
        this.ghosts = [];
};

Pacman.Main.prototype = {
    preload: function() {
        console.log('Main.preload');
        
    },
    create: function() {
        console.log('Main.create');
        this.game.random = new Phaser.RandomDataGenerator();
        this.game.score = 0;
        this.game.lives = 3;
        this.game.gameOver = false;
        
        this.game.movementKeys = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };
        
        this.game.soundChomp = this.game.add.audio('chomp', 1);
        this.game.soundDeath = this.game.add.audio('death', 1);
        this.game.soundEatFruit = this.game.add.audio('eatfruit', 1);
        this.game.soundEatGhost = this.game.add.audio('eatghost', 1);
        this.game.soundExtraPac = this.game.add.audio('extrapac', 1);
        this.game.soundIntermission = this.game.add.audio('intermission', 1);
        
        //game.world.setBounds(-0, 0, 800, 600);
        
        // The player and its settings
        this.player = new Pacman.Player(this.game);
        
        this.tilemap = new Pacman.Tilemap(this.game, this.player);

        
        
        for (var i = 0; i < 1; i++) {
            var ghost = new Pacman.Ghost(this.game, this.player, i);
            ghost.setTilemap(this.tilemap);

            this.ghosts.push(ghost);
        }

        this.text = this.game.add.text(32, 32 * 10, this.getScoreBoardText(), {
            font: "14px Arial",
            fill: "#FFFFFF",
            align: "left"
        });
    },

    update: function() {
        //  Collide the player and the stars with the platforms
        //game.physics.arcade.collide(player.sprite, platforms);
        //game.physics.arcade.collide(stars, platforms);
        //game.physics.arcade.collide(stars, player.bullets);
        //game.physics.arcade.overlap(player.sprite, stars, collectStar, null, this);
        //game.physics.arcade.overlap(player.bullets, platforms, bulletHitPlatform, null, this);
        //game.physics.arcade.collide(player.sprite, tilemap.trees);
        this.game.physics.arcade.collide(this.player.sprite, this.tilemap.level);
        this.game.physics.arcade.overlap(this.player.sprite, this.tilemap.pills);
        
        for(var i in this.ghosts) {
            this.game.physics.arcade.collide(this.ghosts[i].sprite, this.tilemap.level);
            this.game.physics.arcade.overlap(this.ghosts[i].sprite, this.tilemap.pills, this.ghosts[i].route);
            this.game.physics.arcade.overlap(this.ghosts[i].sprite, this.player.sprite, this.player.die, null, this.player);
        }


        //  Reset the players velocity (movement)
        //player.sprite.body.velocity.x = 0;
        //player.sprite.body.velocity.y = 0;



        if (this.game.input.activePointer.isDown) {
            //player.fire();
        }

        //  Allow the player to jump if they are touching the ground.
        //if (cursors.up.isDown && player.sprite.body.touching.down)
        //{
        //    player.sprite.body.velocity.y = -350;
        //}

        this.player.update();
        for(var i in this.ghosts) {
            this.ghosts[i].update();    
        }
        
        this.text.setText(this.getScoreBoardText());

        if (this.game.gameOver) {
            console.log("GAME OVER!");
        }

    },

    render: function() {
        //player.render();
        
        this.game.debug.text( this.player.sprite.position.x.toFixed(0) + ", " + this.player.sprite.position.y.toFixed(0), 32*11, 32*16 );
    },

    getScoreBoardText: function() {
        var minutes = Math.floor(this.game.time.totalElapsedSeconds() / 60);
        var seconds = (this.game.time.totalElapsedSeconds() - minutes * 60).toFixed(3);
        return "- Pills: " + this.game.score + "\n- Lives: " + this.game.lives + "\n- Time: " + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
    }
};
