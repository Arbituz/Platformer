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

    //select and play bgmusic
    music = game.add.audio('8bitbeat');
    music.loop = true;
    music.play();

    //assign variables to sfx
    sfx_coinHit = game.add.audio('coinHit');
    sfx_jump = game.add.audio('jump');
    sfx_coinPickup = game.add.audio('coinPickup');
    sfx_enemyKill = game.add.audio('enemyKill');

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
    player.anchor.setTo(.5, .5);
    player.body.collideWorldBounds = true;
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
    game.physics.arcade.overlap(player, enemies, enemyCollide, null, this);
    game.physics.arcade.overlap(player, coins, collectCoin, null, this);
    game.physics.arcade.collide(player, coinBoxes, coinBoxCollide, null, this);

    //reset player velocity
    player.body.velocity.x = 0;

    //react to player input and play correct animation
    if(keyLeft.isDown) {
      player.body.velocity.x = -250;
      player.scale.x = -1;
    }
    else if(keyRight.isDown) {
      player.body.velocity.x = 250;
      player.scale.x = 1;
    }

    if(jumpButton.isDown && player.body.onFloor()) {
      playerJump();
    }

    function playerJump() {
      sfx_jump.play();
      player.body.velocity.y = -700;
    }

    function collectCoin(player, coins) {
      sfx_coinPickup.play();
      coins.kill();
      this.score += 1;
      this.currentScore.setText("Score: " + this.score);
    }

    function enemyCollide(player, enemies) {
      if (player.body.touching.down) {
        sfx_enemyKill.play();
        enemies.destroy();
        player.body.velocity.y = - 400;
        newEnemy = game.add.sprite(enemies.x, enemies.y, 'enemy');
        newEnemy.animations.add('enemy_kill', [3, 3, 4, 3], 6, true);
        newEnemy.animations.play('enemy_kill', 5, false, true);
        this.score += 1;
        this.currentScore.setText("Score: " + this.score);
      }
      else {
          newPlayer = game.add.sprite(player.x, player.y, 'player');
          player.kill();
          game.physics.enable(newPlayer, Phaser.Physics.ARCADE);
          newPlayer.enableBody = true;
          newPlayer.body.velocity.y = - 500;
          newPlayer.body.gravity.y = 1500;
        }
      }

    function coinBoxCollide(player, coinBoxes) {
      if(player.body.touching.up) {
        if (!coinBoxes.frame == 1) {
          sfx_coinHit.play();
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
