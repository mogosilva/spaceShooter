var spaceShooter = spaceShooter || {};

spaceShooter.mainMenu = function(){};

var enterKey;
var player;
var cursors;
var shoot;
var pewPews;
var playerFireTimer = 0;
var leftKey;
var rightKey;
var spacebar;
var style;
var text;

function shootPewPews () {

    // Have the player only shoot once either the bullet has left the screen OR once it has hit an enemy
    
    if (spaceShooter.game.time.now > playerFireTimer) {

        pew = pewPews.getFirstExists(false);

        if (pew){

        pew.reset(player.x, player.y +8);
        pew.body.velocity.y = -400;
        playerFireTimer = spaceShooter.game.time.now + 500;
        }

    }
}


spaceShooter.mainMenu.prototype = {

  create: function() {
   
    this.add.sprite(0,0, "space");
    text = "Press ENTER to begin";
    style = { font: 'Lato', fontSize: "30px", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, 100, text, style);
    t.anchor.set(0.5);

    player = this.add.sprite(this.world.width-468, this.world.height -300, "player");
    player.animations.add("left",[0],10,true);
    player.animations.add("right",[2],10,true);
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.width = 60;
    player.body.height = 50;
    player.body.offset.x = 22;
    player.body.offset.y = 45;

    pewPews = this.add.group();
    pewPews.enableBody = true;
    pewPews.physicsBodyType = Phaser.Physics.ARCADE;
    pewPews.createMultiple(10, "bullet");
    pewPews.setAll("anchor.x",-1.15);
    pewPews.setAll("anchor.y",1);
    pewPews.setAll("outOfBoundsKill", true);
    pewPews.setAll("checkWorldBounds",true);

    enterKey = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    cursors = spaceShooter.game.input.keyboard.createCursorKeys();
    shoot = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    leftKey = this.add.sprite(this.world.width-320, this.world.height -130, "arrows");
    rightKey = this.add.sprite(this.world.width-220, this.world.height -130, "arrows");
    spacebar = this.add.sprite(this.world.width-680,this.world.height -130, "spacebar");

  },
  update: function() {

     player.body.velocity.setTo(0, 0);

      if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
            player.animations.play("left");
            leftKey.frame = 1;
        }
      else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
            player.animations.play("right");
            rightKey.frame = 3;
        }
      else{
            player.animations.stop();
            player.frame = 1;
            leftKey.frame = 0;
            rightKey.frame = 2;
        }

        if (shoot.isDown){

            shootPewPews();
            spacebar.frame = 1;
        }
        else{
          spacebar.frame = 0;
        }

    if (enterKey.isDown){
      this.game.state.start('game');
  }
  }
};