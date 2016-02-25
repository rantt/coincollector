var wKey;
var aKey;
var sKey;
var dKey;

var Player = function(game,x, y) {
  this.game = game;
  // this.ninja = null;

  // this.jumpSnd = this.game.add.sound('jump');
  // this.jumpSnd.volume = 0.5;


  // this.slashSnd = this.game.add.sound('slash');
  // this.slashSnd.volume = 0.2;

  this.edgeTimer = 0;
  this.jumpSpeed = 350;
  this.jumpTimer = 0;
  this.moveSpeed = 150;
  this.facing = 'right';
  this.wasStanding = false;
  this.standing = false;

    // this.game.load.spritesheet('player', 'assets/images/player.png', 20, 20, 5);
  // this.game.load.spritesheet('ninja', 'assets/images/ninja2.png', 18, 18, 25);
  Phaser.Sprite.call(this, this.game, x, y, 'player');
  this.game.add.existing(this);
  // this.ninja = this.game.add.sprite(x,y, 'player');
  this.health = 100;
  // this.ninja.health = 100;
  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5, 0.5);
  this.body.setSize(10, 18);

  this.animations.add('right', [2, 3], 10, true);
  this.animations.add('left', [4, 5], 10, true);

  this.body.collideWorldBounds = true;
  // this.ninja.checkWorldBounds = true;
  // this.ninja.outOfBoundsKill = true;
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
Player.prototype.movements = function() {
  this.standing = this.body.blocked.down || this.body.touching.down;

  this.body.velocity.x = 0;

  if (aKey.isDown || this.cursors.left.isDown) {
    this.body.velocity.x = -this.moveSpeed;
    this.body.setSize(10, 18, 2, 0);
      this.play('left');
    if (this.facing !== 'left') {
      // this.animations.play('left');
      this.facing = 'left';
    }
    // if (this.body.blocked.down === false) {
    if (this.standing === false) {
      this.frame = 7;
    }
  }else if (dKey.isDown || this.cursors.right.isDown) {
    this.body.velocity.x = this.moveSpeed;
    this.body.setSize(10, 18, -2, 0);
      this.play('right');
    if (this.facing !== 'right') {
      // this.animations.play('right');
      // this.play('right');
      this.facing = 'right';
    }
    // if (this.body.blocked.down === false) {
    if (this.standing === false) {
      this.frame = 6;
    }
  }else {
    // if (this.facing !== 'idle') {
      this.animations.stop();
      
      this.body.setSize(10, 18, 0, 0);
      if(this.facing === 'left') {
        this.frame = 1;
      }else {
        this.frame = 0;
      }
      // this.facing = 'idle';
    // }
  }

    //Show Attack Frame
    if (spaceKey.isDown) {
      if (this.facing === 'left') {
        if (this.body.blocked.down === false) {
          this.frame = 11;
        }else {
          this.frame = 9;
        }
      }else {
        if (this.body.blocked.down === false) {
          this.frame = 10;
        }else {
          this.frame = 8;
        }
      }
      // this.attack();
    }

    if (!this.standing && this.wasStanding) {
      this.edgeTimer = this.game.time.now + 250;
    }

    if ((this.standing || this.game.time.now <= this.edgeTimer) && (wKey.isDown || this.cursors.up.isDown) && this.game.time.now > this.jumpTimer) {

      // this.jumpSnd.play();
      this.body.velocity.y = -this.jumpSpeed;
      this.jumpTimer = this.game.time.now + 750;
    }
    this.wasStanding = this.standing;

    //Lower Jump Height if released early
    wKey.onUp.add(function() {
      if (this.body.velocity.y < -150) {
        this.body.velocity.y = -100;
      }
    }, this);

    this.cursors.up.onUp.add(function() {
      if (this.body.velocity.y < -150) {
        this.body.velocity.y = -100;
      }
    }, this);





};


// Player.prototype = {
//   // preload: function() {
//   //   this.game.load.spritesheet('player', 'assets/images/player.png', 20, 20, 5);
//   // },
//   movements: function() {
//
//     // this.standing = this.ninja.body.blocked.down || this.ninja.body.touching.down;
//     //
//     // if (aKey.isDown || this.cursors.left.isDown) {
//     //   this.body.velocity.x = -this.moveSpeed;
//     //   this.body.setSize(10, 18, 2, 0);
//     //     this.play('left');
//     //   if (this.facing !== 'left') {
//     //     // this.animations.play('left');
//     //     this.facing = 'left';
//     //   }
//     //   // if (this.body.blocked.down === false) {
//     //   if (this.standing === false) {
//     //     this.frame = 7;
//     //   }
//     // }else if (dKey.isDown || this.cursors.right.isDown) {
//     //   this.body.velocity.x = this.moveSpeed;
//     //   this.body.setSize(10, 18, -2, 0);
//     //     this.play('right');
//     //   if (this.facing !== 'right') {
//     //     // this.animations.play('right');
//     //     // this.play('right');
//     //     this.facing = 'right';
//     //   }
//     //   // if (this.body.blocked.down === false) {
//     //   if (this.standing === false) {
//     //     this.frame = 6;
//     //   }
//     // }else {
//     //   // if (this.facing !== 'idle') {
//     //     this.animations.stop();
//     //     
//     //     this.body.setSize(10, 18, 0, 0);
//     //     if(this.facing === 'left') {
//     //       this.frame = 1;
//     //     }else {
//     //       this.frame = 0;
//     //     }
//     //     // this.facing = 'idle';
//     //   // }
//     // }
//
//   },
//   attack: function() {
//
//   },
// };

Player.prototype.constructor = Player;
