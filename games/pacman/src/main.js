(function() {
    var game = new Phaser.Game(896, 992, Phaser.AUTO, '');
    game.state.add('Boot', Pacman.Boot);
    game.state.add('Preloader', Pacman.Preloader);
    game.state.add('Menu', Pacman.Menu);
    game.state.add('Game', Pacman.Main);
    game.state.start('Boot');
})();