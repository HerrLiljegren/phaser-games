'use strict';
var Spaceshooter = Spaceshooter || {};
Spaceshooter.Game = function(game) {
    this.game = game,
        this.player = null,
        this.meteors = null,
        this.gameOverTimer = 30000,
        this.lastGameOverTriggered = 0,
        this.playerScore = 0
}
Spaceshooter.Game.prototype = {

    create: function() {
        console.log('Game.create');


        this.game.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, "background");
        this.game.background.speed = 10;

        //add player
        this.player = new Spaceshooter.Player(this.game);
        this.playerScore = 0;

        //add meteors
        this.meteors = new Spaceshooter.Meteors(this.game);
        
        //add enemy spaceships
        this.spaceships = new Spaceshooter.SpaceShips(this.game, this.player.player);

    },

    update: function() {
        this.player.update();
        this.meteors.update();
        this.spaceships.update(); 
        this.game.background.tilePosition.y += this.game.background.speed;
       
    
        
        //check for meteor collision with player   
        for (var i = 0; i < this.meteors.meteors.length; i++) {
            var meteor = this.meteors.meteors.children[i];

            if (meteor.alive) {
                this.game.physics.arcade.overlap(meteor, this.player.player, function() {
                        this.game.state.start("GameOver");
                    },
                    null, this);
            }
        }
        
        //check for bullet collision with meteors
        this.game.physics.arcade.overlap(this.meteors.meteors, this.player.bullets, function(meteor, bullet) {
               this.playerScore++;
               console.log("New Score: " + this.playerScore);
               meteor.kill();
               bullet.kill();
               
            },
            null, this);
            
        //check for bullet collision with meteors
        this.game.physics.arcade.overlap(this.spaceships.ships, this.player.bullets, function(ship, bullet) {
               this.playerScore++;
               console.log("New Score: " + this.playerScore);
               meteor.kill();
               ship.kill();
               
            },
            null, this);            


    },

    render: function() {
        this.player.render();
        //this.meteors.render();
    }
}