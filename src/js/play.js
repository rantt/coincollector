/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  init: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);


		this.game.stage.backgroundColor = '#ececec';

    this.map = this.game.add.tilemap('level1');
    // this.map.addTilesetImage('tiles', 'tiles');
    this.map.addTilesetImage('tiles');
    this.map.setCollision(1);
    // this.map.setCollision(2);
    // this.map.setCollision(3);
    // this.map.setCollision(4);
    // this.map.setCollision(5);
    // this.map.setCollision(6);
    
    this.layer = this.map.createLayer('layer1'); 

    this.powerups = this.game.add.group();
    this.powerups.enableBody = true;


    this.portals = this.game.add.group();
    this.portals.enableBody = true;

    this.map.createFromObjects('objects',6, 'tiles', 5, true, false, this.powerups); 
    this.map.createFromObjects('objects',2, 'tiles', 1, true, false, this.portals); 

    this.layer.resizeWorld();

    this.player = new Player(this.game, Game.w/2, Game.h/2);
    console.log(this.player);

    // this.powerups.forEach(function(p) {
    // }, this);

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    // wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    // aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    // sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);


    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },

  update: function() {
    
    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.overlap(this.player, this.powerups, this.pickUpPowerup, null, this);
    this.game.physics.arcade.overlap(this.player, this.portals, this.enterPortal, null, this);

    this.player.movements();

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  enterPortal: function(player, portal) {
    console.log('jump to next level.');
  },
  pickUpPowerup: function(player, powerup) {
    powerup.destroy();  
    this.player.jumps++;
  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = [''];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
