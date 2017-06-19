//title.js
var titleState = {
  create: function() {
    game.add.tileSprite(0, 0, 800, 480, 'titlePage');
    var nameLabel = game.add.text(325,390, 'Press SPACE to continue...', {
        font: '14px Arial', fill: '#000000'
      });
    spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update: function() {
    if (spaceBar.isDown) {
        game.state.start('play')
     }
    }
};
