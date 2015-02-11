var Spaceshooter = Spaceshooter || {};
(function() {
    var game = new Phaser.Game(720, 1280, Phaser.AUTO, '');
    console.log("Running Main.js to add states");
    game.state.add('Boot', Spaceshooter.Boot);
    game.state.add('Preload', Spaceshooter.Preload);
    // game.state.add('Menu', Pacman.Menu);
    game.state.add('Game', Spaceshooter.Game);
    game.state.add('GameOver', Spaceshooter.GameOver);
    game.state.start('Boot');
})();