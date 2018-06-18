//definir las variables del juego
var game;

var map;
var player;
var cursors;
var groundLayer, coinLayer; // capas de la moneda
var fondoLayer;
var text, text2;
var score = 0;

function preload() {
  // map made with Tiled in JSON format
  this.load.tilemapTiledJSON("map", "./assets/mario-style/map.json");
  // tiles in spritesheet
  this.load.spritesheet("tiles", "./assets/mario-style/tiles.png", {
    frameWidth: 70,
    frameHeight: 70
  });
//   this.load.spritesheet("tiles2", "./assets/plataforma-example1/tiles2.png", {
//     frameWidth: 70,
//     frameHeight: 70
//   });
//   this.load.spritesheet("items", "./assets/plataforma-example1/items.png", {
//     frameWidth: 70,
//     frameHeight: 70
//   });
  // simple coin image
  this.load.image('coin', './assets/mario-style/coinGold.png');
  // player animations
  this.load.atlas(
    "player",
    "./assets/mario-style/player.png",
    "./assets/mario-style/player.json"
  );
}

function create() {
  // load the map
  map = this.make.tilemap({ key: "map" });

  // tiles for the ground layer
  var groundTiles = map.addTilesetImage("tiles");
  groundLayer = map.createDynamicLayer("World", groundTiles, 0, 0);
  groundLayer.setCollisionByExclusion([-1]);

  //rampaLayer.setCollisionByExclusion([-1]);
  // coin image used as tileset
  var coinTiles = map.addTilesetImage('coin');        
  coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

  // set the boundaries of our game world
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;

  // create the player sprite
  player = this.physics.add.sprite(200, 200, "player");
  player.setBounce(0.2); // our player will bounce from items
  player.setCollideWorldBounds(true); // don't go out of the map

  // small fix to our player images, we resize the physics body object slightly
  player.body.setSize(player.width, player.height - 8);

  // player will collide with the level tiles
  this.physics.add.collider(groundLayer, player);    

  coinLayer.setTileIndexCallback(17, collectCoin, this);
  // when the player overlaps with a tile with index 17, collectCoin
  // will be called
  this.physics.add.overlap(player, coinLayer);

  // player walk animation
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNames("player", {
      prefix: "p1_walk",
      start: 1,
      end: 11,
      zeroPad: 2
    }),
    frameRate: 10,
    repeat: -1
  });
  // idle with only one frame, so repeat is not neaded
  this.anims.create({
    key: "idle",
    frames: [{ key: "player", frame: "p1_stand" }],
    frameRate: 10
  });

  cursors = this.input.keyboard.createCursorKeys();

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // make the camera follow the player
  this.cameras.main.startFollow(player);

  // set background color, so the sky is not black
  this.cameras.main.setBackgroundColor("#ccccff");

  // this text will show the score
  text = this.add.text(20, 20, "Puntaje: 0", {
    fontSize: "20px",
    fill: "#ffffff"
  });

  text2 = this.add.text(240, 280, "Has ganado", {
    fontSize: "60px",
    fill: "#ffffff"    
  });
  // fix the text to the cameras
  text.setScrollFactor(0);
  text2.setScrollFactor(0);
  text2.setVisible(false);
}

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
        coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
        score++; // add 10 points to the score
        text.setText(`Puntaje: ${score}`); // set the text to show the current score
        if (score == 60) {
            endGame();
        } 
        return false;
}

function update(time, delta) {
  if (cursors.left.isDown) {
    player.body.setVelocityX(-200);
    player.anims.play("walk", true); // walk left
    player.flipX = true; // flip the sprite to the left
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(200);
    player.anims.play("walk", true);
    player.flipX = false; // use the original sprite looking to the right
  } else {
    player.body.setVelocityX(0);
    player.anims.play("idle", true);
  }
  // jump
  if (cursors.up.isDown && player.body.onFloor()) {
    player.body.setVelocityY(-500);    
  }
}

function endGame(sprite, tile) {      
  text2.setVisible(true);
}

//ecmascript5
var config = {
  type: Phaser.CANVAS, // phaser es el framework,canvas el motor de renderizado
  width: 800, //ancho
  height: 600, //altura
  physics: {
    // fisica del juego
    default: "arcade", // fisica del juego
    arcade: {
      gravity: { y: 500 }, //gravedad del jugador
      debug: false
    }
  },
  scene: {
    // todo lo que ocupa el juego
    key: "main",
    preload: preload,
    create: create,
    update: update
  }
  //scene: [GameScene, MenuScene]
};

game = new Phaser.Game(config);
