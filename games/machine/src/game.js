/* global Machine: true, Phaser: true */
'use strict';

(function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, '');
    game.state.add('Boot', Machine.Boot);
    game.state.add('Preloader', Machine.Preloader);
    game.state.add('Menu', Machine.Menu);
    game.state.add('Game', Machine.Main);
    //game.state.add('GameOver', Machine.GameOver);
    game.state.start('Boot');
})();