//load.js

var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: "#ffffff"});

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.PageAlignHorizonally = true;
    game.scale.PageAlignVertically = true;
    game.stage.backgroundColor = '#000000';

    /****** Load graphics assets ******/
    game.load.tilemap('level', 'assets/maps/room1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('foreground', 'assets/sprites/world.png');
    //game.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/player.json');
    game.load.image('player', 'assets/sprites/player2.png');
    game.load.image('background', 'assets/sprites/background.png');
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
    game.load.image('titlePage', 'assets/sprites/title.png');
    game.load.spritesheet('enemy', 'assets/sprites/enemy.png', 32, 32);
    game.load.spritesheet('coinBox', 'assets/sprites/coinBox.png', 32, 32);
    game.load.image('brick', 'assets/sprites/brick.png');
    game.load.spritesheet('coinHit', 'assets/sprites/coinHit.png', 32, 64);
  },
  create: function() {
    game.state.start('title');
  }
};
