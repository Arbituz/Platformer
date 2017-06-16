//play.js test
var playState = {
  player: null,
  foreground: null,
  background: null,

  create: function() {
    // display tiles for maps
    game.stage.backgroundColor = "#42b3f4";
    game.world.setBounds(0, 0, 1920, 480)

    var map = game.add.tilemap('level');
    map.addTilesetImage('background', 'background');
    map.addTilesetImage('world', 'foreground');


    background = map.createLayer('Background');
    foreground = map.createLayer('Foreground');

    map.setCollisionBetween(1, 2000, true, 'Foreground');

    //setup player
    player = game.add.sprite(410,200, 'player');
    game.add.existing(player);
    player.animations.add('player_idle', Phaser.Animation.generateFrameNames('sprite', 1, 3), 2);
    player.animations.add('player_walking', Phaser.Animation.generateFrameNames('sprite', 4, 6), 6);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    game.camera.follow(player);
    player.anchor.setTo(.1, .1);

    //enable gravity
    game.physics.arcade.gravity.y = 900;

    //load in key inputs
    cursors = game.input.keyboard.createCursorKeys();
    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  update: function() {

    game.physics.arcade.collide(player, foreground);

    player.body.velocity.x = 0;


    //react to player input and play correct animation
    if(keyLeft.isDown) {
      player.body.velocity.x = -250;
      player.scale.x = -1;
      if(!player.animations.play('player_walking')) {
        player.animations.play('player_walking');
      }
    }
    if(keyRight.isDown) {
      player.body.velocity.x = 250;
      player.scale.x = 1;
      if(!player.animations.play('player_walking')) {
        player.animations.play('player_walking');
      }
    }
    if(player.body.velocity.x == 0) {
      player.animations.play('player_idle');
    }
    if(jumpButton.isDown) {
      playerJump();
    }

    function playerJump() {
      player.body.velocity.y = -600;
    }

   }
};
