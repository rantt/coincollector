/*global Game*/
Game.Win = function(game){
  this.game = game;
};

Game.Win.prototype =  {
    create: function() {

		this.game.stage.backgroundColor = '#716A74';
      //Setup WASD and extra keys
      this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.cursors = this.game.input.keyboard.createCursorKeys();

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(Game.w/2, Game.h/2+100,'twitter', this.twitter, this);
    this.twitterButton.fixedToCamera = true;
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;


      this.playAgainText = this.game.add.bitmapText(Game.w + 100, Game.h/2, 'minecraftia','Play Again?',48);
      
      this.playAgainText.anchor.set(0.5);
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() { 
          this.game.add.tween(this.playAgainText).to({x: Game.w/2}, 355, Phaser.Easing.Linear.None).start();
          this.twitterButton.visible = true;
      }, this);

    },
    update: function() {
      //Click to Start
      // if (this.game.input.activePointer.isDown){
      if (this.game.input.activePointer.isDown || this.wKey.isDown || this.cursors.up.isDown){
        coins_count = 0;
        coins = 0;
        this.game.state.start('Play');
      }
    },
    twitter: function() {
      //Popup twitter window to post highscore
      var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
      var twitter_name = 'rantt_';
      var tags = [''];

      window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
    },

};
