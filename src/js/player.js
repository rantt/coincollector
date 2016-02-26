var wKey;
var aKey;
var sKey;
var dKey;

var Player = function(game,x, y) {
  this.game = game;

  // this.jumpSnd = this.game.add.sound('jump');
  // this.jumpSnd.volume = 0.5;

  this.edgeTimer = 0;
  this.jumpTimer = 0;
  this.swapTimer = 0;
  this.JUMP_SPEED = -350;
  this.MOVE_SPEED = 150;
  // this.facing = 'right';
  // this.wasStanding = false;
  this.standing = false;
  this.jumping = false;

  Phaser.Sprite.call(this, this.game, x, y, 'player');
  this.game.add.existing(this);
  // this.ninja = this.game.add.sprite(x,y, 'player');
  this.health = 100;
  // this.ninja.health = 100;
  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5, 0.5);
  this.body.setSize(10, 18);

  //Spritesheet
  // 1 - standing
  // 2 - slide left wall
  // 3 - slide right wall
  // 4 - move left
  // 5 - move right

  // this.animations.add('right', [2, 3], 10, true);
  // this.animations.add('left', [4, 5], 10, true);

  this.body.collideWorldBounds = true;
  this.body.gravity.y = 750;
  this.game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);


  //Setup WASD and extra keys
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

  spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.cursors = this.game.input.keyboard.createCursorKeys();

};


Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.leftInputIsActive = function() {
  var isActive = false;
  isActive = this.game.input.keyboard.isDown(Phaser.Keyboard.A);  
  isActive |= this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);  
  return isActive;
};

Player.prototype.rightInputIsActive = function() {
  var isActive = false;
  isActive = this.game.input.keyboard.isDown(Phaser.Keyboard.D);  
  isActive |= this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);  
  return isActive;
};

Player.prototype.upInputIsActive = function(duration) {
  var isActive = false;
  isActive = this.game.input.keyboard.downDuration(Phaser.Keyboard.W, duration);
  isActive |= this.game.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
  return isActive;
};

Player.prototype.upInputRelease = function() {
  var released = false;
  released = this.game.input.keyboard.upDuration(Phaser.Keyboard.W);
  released |= this.game.input.keyboard.upDuration(Phaser.Keyboard.UP);
  return released;
};

Player.prototype.movements = function() {
  this.standing = this.body.blocked.down || this.body.touching.down;
  this.touchingLeft = this.body.blocked.left || this.body.touching.left;
  this.touchingRight = this.body.blocked.right || this.body.touching.right;

  if (this.standing) {
      this.jumps = 2;
      this.jumping = false;
  }


  if (this.leftInputIsActive()) {
    // this.facing = 'left'
    this.facing = 1; 
    this.frame = 4;
    this.body.velocity.x = -this.MOVE_SPEED;
  }else if (this.rightInputIsActive()) {
    // this.facing = 'right'
    this.facing = -1; 
    this.frame = 3;

    this.body.velocity.x = this.MOVE_SPEED;
  }else {
    this.frame = 0;
    this.body.velocity.x = 0;
  }

  if (this.touchingLeft && !this.standing) {
    this.sliding = true;
    this.frame = 1;
  }else if (this.touchingRight && !this.standing) {
    this.sliding = true;
    this.frame = 2;
  }else {
    this.sliding = false;
  }


  if (this.jumps > 0 && this.upInputIsActive(5)) {
    this.body.velocity.y = this.JUMP_SPEED;
    this.jumping = true;
  }

  // if (this.slideTimer > this.game.time.now && this.upInputIsActive(5)) {
  if (this.sliding && this.upInputIsActive(5)) {
    this.jumps++;

    this.game.add.tween(this).to({x: this.x+50*this.facing}, 100, Phaser.Easing.Linear.Out, true, 0); //snap in place
    this.body.velocity.y = this.JUMP_SPEED;
    this.jumping = true;
  }


  if (this.jumping && this.upInputRelease()) {
    this.jumps--;
    this.jumping = false;
  }

};

Player.prototype.constructor = Player;
