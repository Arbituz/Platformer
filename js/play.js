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

    //add coins to coin group
    coins = game.add.group();
    coins.enableBody = true;
    coins.immovable = true;
    coins.allowGravity = false;

    //convert all of the Tiled objects with the ID of 23 into sprites within the coins group
    map.createFromObjects('Collectables', 5, 'coin', 0, true, false, coins);

    //add animations to all of the coin sprites
    coins.callAll('animations.add', 'animations', 'spin', [0, 1], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');

    //setup player
    player = game.add.sprite(50,350, 'player');
    game.add.existing(player);
    player.animations.add('player_idle', Phaser.Animation.generateFrameNames('sprite', 1, 3), 2);
    player.animations.add('player_walking', Phaser.Animation.generateFrameNames('sprite', 4, 6), 6);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.anchor.setTo(.05, .05);
    game.camera.follow(player);
    this.score = 0;


    //enable gravity
    game.physics.arcade.gravity.y = 1500;

    //print score to screen
    this.currentScore = game.add.text(20, 20, 'Score: ' + this.score, {
        font: '14px Arial', fill: '#ffffff'
      });
    this.currentScore.fixedToCamera = true;

    //load in key inputs
    cursors = game.input.keyboard.createCursorKeys();
    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  update: function() {

    //collisions
    game.physics.arcade.collide(player, foreground);
    game.physics.arcade.collide(coins, foreground);
    game.physics.arcade.overlap(player, coins, collectCoin, null, this);

    //reset player velocity
    player.body.velocity.x = 0;

    //react to player input and play correct animation
    if(keyLeft.isDown) {
      player.body.velocity.x = -250;
      player.scale.x = -1;
      if(!player.animations.play('player_walking')) {
        player.animations.play('player_walking');
      }
    }
    else if(keyRight.isDown) {
      player.body.velocity.x = 250;
      player.scale.x = 1;
      if(!player.animations.play('player_walking')) {
        player.animations.play('player_walking');
      }
    }
    if(player.body.velocity.x == 0) {
      player.animations.play('player_idle');
    }
    if(jumpButton.isDown && player.body.onFloor()) {
      playerJump();
    }

    function playerJump() {
      player.body.velocity.y = -700;
    }

    function collectCoin(player, coins) {
      coins.kill();
      this.score += 1;
      this.currentScore.setText("Score: " + this.score);
    }

   }
};
