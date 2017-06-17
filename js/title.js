//title.js
var titleState = {
  create: function() {
    game.add.tileSprite(0, 0, 800, 480, 'titlePage');
    var nameLabel = game.add.text(325,390, 'Click anywhere to start', {
        font: '14px Arial', fill: '#000000'
      });
      game.input.activePointer.capture = true;

    },

    update: function() {
    if (game.input.activePointer.isDown) {
        game.state.start('play')
     }
    }
};
