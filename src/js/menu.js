/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
    //Generate Level with Cellular Automata
    FLOOR = 2;
    WALL = 3;
    this.auto = new Automata(COLS*2, ROWS*2);
    this.auto.generate();
    this.auto.cleanup();

    coin_limit = Math.floor(this.auto.floorCount*0.2);

    for(var i = 0; i < coin_limit;i++) {
      var x = rand(2, COLS*2-2);
      var y = rand(2, ROWS*2-2);
      if (this.auto.map[y][x] === FLOOR &&
          this.auto.map[y-1][x] === FLOOR &&
          this.auto.map[y+1][x] === FLOOR &&
          this.auto.map[y][x-1] === FLOOR &&
          this.auto.map[y][x+1]) {
        this.auto.map[y][x] = 5;
        // coin_count++;
      }
    } 

    var cave = this.auto.csv();

    this.game.load.tilemap('level', null, cave, Phaser.Tilemap.CSV );
    this.map = this.game.add.tilemap('level', TILE_SIZE, TILE_SIZE);
    this.map.addTilesetImage('tiles'); //use generated sheet
    this.map.setTileIndexCallback(5, this.collectCoin, this);

    this.layer = this.map.createLayer(0);
    this.map.setCollision(0); //Black Empty Space
    this.layer.resizeWorld();


        // this.title = this.game.add.sprite(Game.w/2,Game.h/2-100,'title');
        // this.title.anchor.setTo(0.5,0.5);
    this.titleText = this.game.add.bitmapText(Game.w/2, Game.h/2-100, 'minecraftia', "Coin Collector", 42 );
    this.titleText.anchor.setTo(0.5);
    this.titleText.tint = 0xffff00;

    this.game.add.tween(this.titleText)
      .to( {y:100 }, 2000, Phaser.Easing.Linear.In, true, 0, -1)
      .yoyo(true);

    this.instructions = this.game.add.sprite(Game.w/2+200,200,'instructions');
    this.instructions.scale.x = 0.5;
    this.instructions.scale.y = 0.5;






        // Start Message

        var clickText = this.game.add.bitmapText(Game.w/2, Game.h/2+50, 'minecraftia', '~click to start~', 24).anchor.setTo(0.5); 

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};
