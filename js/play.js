//play.js test
var playState = {
  player: null,
  coinBox: null,
  foreground: null,
  background: null,
  coinHit: null,

  create: function() {
    //start phsyics system and set gravity
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1500;

    // display tiles for maps
    game.stage.backgroundColor = "#42b3f4";
    game.world.setBounds(0, 0, 1920, 480);

    var map = game.add.tilemap('level');
    map.addTilesetImage('background', 'background');
    map.addTilesetImage('world', 'foreground');

    background = map.createLayer('Background');
    foreground = map.createLayer('Foreground');

    map.setCollisionBetween(1, 2000, true, 'Foreground');

    //create groups
    enemies = game.add.group();
    coinBoxes = game.add.group();
    coins = game.add.group();

    //enable physics on all groups
    game.physics.enable([enemies, coinBoxes, coins], Phaser.Physics.ARCADE);

    //setup enemy
    enemies.enableBody = true;
    enemies.immovable = true;

    //setup coins
    coins.enableBody = true;
    coins.immovable = true;

    //setup coinBoxes
    coinBoxes.enableBody = true;
    coinBoxes.immovable = true;

    //setup player
    player = game.add.sprite(50,350, 'player');
    game.add.existing(player);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.anchor.setTo(.5, 0);
    game.camera.follow(player);
    this.score = 0;

    //print score to screen
    this.currentScore = game.add.text(20, 20, 'Score: ' + this.score, {font: '14px Arial', fill: '#ffffff'});

    //keep score in one spot
    this.currentScore.fixedToCamera = true;

    //convert all of the Tiled objects , write to screen, and add to groups
    map.createFromObjects('Collectables', 110, 'coin', 0, true, false, coins);
    map.createFromObjects('Collectables', 108, 'coinBox', 0, true, false, coinBoxes);
    enemy = map.createFromObjects('Enemies', 1, 'enemy', 0, true, false, enemies);

    //add animations to all sprites that need it
    coins.callAll('animations.add', 'animations', 'spin', [0, 1], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');
    enemies.callAll('animations.add', 'animations', 'enemy_walk', [0, 1 ,2], 4, true);
    enemies.callAll('animations.play', 'animations', 'enemy_walk');
    //player.animations.add('player_idle', Phaser.Animation.generateFrameNames('sprite', 1, 3), 2);
    //player.animations.add('player_walking', Phaser.Animation.generateFrameNames('sprite', 4, 6), 6);

    //make enemies move
    enemies.forEach(function(enemy){
      enemy.body.velocity.x = -20;
    });

    //load in key inputs
    cursors = game.input.keyboard.createCursorKeys();
    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    coinBoxes.setAll('body.allowGravity', false);
    coinBoxes.setAll('body.immovable', true);


  },

  update: function() {

    //collisions
    game.physics.arcade.collide(enemies, foreground);
    game.physics.arcade.collide(player, foreground);
    game.physics.arcade.collide(coins, foreground);
    game.physics.arcade.collide(player, enemies, enemyCollide, null, this);
    game.physics.arcade.overlap(player, coins, collectCoin, null, this);
    game.physics.arcade.collide(player, coinBoxes, coinBoxCollide, null, this);

    //reset player velocity
    player.body.velocity.x = 0;

    //react to player input and play correct animation
    if(keyLeft.isDown) {
      player.body.velocity.x = -250;
      player.scale.x = -1;
    //  if(!player.animations.play('player_walking')) {
      //  player.animations.play('player_walking');
      //}
    }
    else if(keyRight.isDown) {
      player.body.velocity.x = 250;
      player.scale.x = 1;
      //if(!player.animations.play('player_walking')) {
        //player.animations.play('player_walking');
      //}
    }
    //if(player.body.velocity.x == 0) {
      //player.animations.play('player_idle');
    //}

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

    function enemyCollide(player, enemies) {
      if (player.body.y +50 < enemies.body.y) {
        enemies.kill();
        player.body.velocity.y = - 400;
        newEnemy = game.add.sprite(enemies.x, enemies.y, 'enemy');
        newEnemy.animations.add('enemy_kill', [3, 3, 4, 3], 6, true);
        newEnemy.animations.play('enemy_kill', 5, false, true);
        this.score += 1;
        this.currentScore.setText("Score: " + this.score);
      }
      else {
        player.kill();
      }
    }

    function coinBoxCollide(player, coinBoxes) {
      if (player.body.y > coinBoxes.body.y) {
        if (!coinBoxes.frame == 1) {
          coinBoxes.frame = 1;
          this.score += 1;
          coinHit = game.add.sprite(coinBoxes.x, coinBoxes.y - 70, 'coinHit');
          coinHit.animations.add('coin_hit', [0, 1, 2, 3, 4], 17, false);
          coinHit.animations.play('coin_hit', 20, false, true);
        }
      }
    }

  }
};
