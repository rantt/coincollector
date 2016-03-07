/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var coin_count = 0;
var coins = 0;
var FLOOR,WALL;
var dFloor, dRows, dCols;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  init: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.stage.backgroundColor = '#716A74';


    //Pickup sfx
    this.coinSnd = this.game.add.sound('coin'); 
    this.coinSnd.volume = 0.2;

    // Music
    this.music = this.game.add.sound('music');
    this.music.volume = 0.3;
    this.music.loop = true;
    this.music.play();

		// this.game.stage.backgroundColor = '#192331';

    //Generate Level with Cellular Automata
    FLOOR = 2;
    WALL = 3;
    this.auto = new Automata(COLS*2, ROWS*2);
    this.auto.generate();
    this.auto.cleanup();

    coin_limit = Math.floor(this.auto.floorCount*0.4);

    for(var i = 0; i < coin_limit;i++) {
      var x = rand(2, COLS*2-2);
      var y = rand(2, ROWS*2-2);
      if (this.auto.map[y][x] === FLOOR &&
          this.auto.map[y-1][x] === FLOOR &&
          this.auto.map[y+1][x] === FLOOR &&
          this.auto.map[y][x-1] === FLOOR &&
          this.auto.map[y][x+1]) {
        this.auto.map[y][x] = 5;
      }
    } 

    coin_count = this.auto.countTile(5);

    if (coin_count === undefined || coin_count === 0) {
      this.game.state.start('Play');
    }

    var cave = this.auto.csv();

    this.game.load.tilemap('level', null, cave, Phaser.Tilemap.CSV );
    this.map = this.game.add.tilemap('level', TILE_SIZE, TILE_SIZE);
    this.map.addTilesetImage('tiles'); //use generated sheet
    this.map.setTileIndexCallback(5, this.collectCoin, this);

    this.layer = this.map.createLayer(0);

    this.map.setCollision(WALL); //Black Empty Space
    this.layer.resizeWorld();

		this.coinsText = this.game.add.bitmapText(Game.w-200,10,'minecraftia','Coins: '+coins+'/'+coin_count,24);
    this.coinsText.tint = 0xffff00;
    this.coinsText.fixedToCamera = true;


    var notplaced = true;
    while (notplaced) {
      var x = rand(2, COLS*2-2);
      var y = rand(2, ROWS*2-2);
      if (this.auto.map[y][x] === FLOOR) {
        this.player = new Player(this.game, x*TILE_SIZE, y*TILE_SIZE);
        notplaced = false;
      }
    }

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.cursors = this.game.input.keyboard.createCursorKeys();


    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.fixedToCamera = true;
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },
  collectCoin: function(player,coin) {
    this.coinSnd.play();
    coins++;
    coin.index = FLOOR;
    this.layer.dirty = true;

  },
  update: function() {
   
    if (coin_count > coins) { 
      this.game.physics.arcade.collide(this.player, this.layer);
      this.coinsText.setText('Coins: '+coins+'/'+coin_count);
      this.player.movements();
    }else if (coin_count > 0 && coins >= coin_count) {
      this.music.stop();
      this.game.state.start('Win');
    }
    else {
      this.game.state.start('Play');
    }

  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/coincollector/'; 
    var twitter_name = 'rantt_';
    var tags = [''];

    window.open('http://twitter.com/share?text=I+Beat+Coin+Collector+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },


};
