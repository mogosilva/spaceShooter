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
var start;

//Player firing function
function shootPewPews () {

    // Have the player only shoot once either the bullet has left the screen OR once it has hit an enemy
    
    if (spaceShooter.game.time.now > playerFireTimer) {

        pew = pewPews.getFirstExists(false);

        if (pew){

        pew.reset(player.x, player.y +8);
        pew.body.velocity.y = -400;

        //delay to bullet fire
        playerFireTimer = spaceShooter.game.time.now + 500;
        }

    }
}

function moveLeft (){

        player.body.velocity.x = -200;
        player.animations.play("left");
        leftKey.frame = 1;
}

function moveRight (){

            player.body.velocity.x = 200;
            player.animations.play("right");
            rightKey.frame = 3;
}

spaceShooter.mainMenu.prototype = {

  create: function() {
   
    this.add.sprite(0,0, "space");

    player = this.add.sprite(this.world.width-(this.world.width/1.8), this.world.height -(this.world.height/2.90), "player");
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

    if (this.game.device.desktop)
    {
        text = "Press ENTER to begin";
        style = { font: 'Lato', fontSize: "30px", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width/2, 100, text, style);
        t.anchor.set(0.5);

        enterKey = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        cursors = spaceShooter.game.input.keyboard.createCursorKeys();
        shoot = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        leftKey = this.add.sprite(this.world.width-(this.world.width/2.5), this.world.height -(this.world.width/10), "arrows");
        rightKey = this.add.sprite(this.world.width-(this.world.width/3.5), this.world.height -(this.world.width/10), "arrows");
        spacebar = this.add.sprite(this.world.width-(this.world.width/1.2),this.world.height -(this.world.width/10), "spacebar");
        start = 0;
    } else{

        text = "ARROW KEYS = MOVE / SPACEBAR = FIRE";
        style = { font: 'Lato', fontSize: "30px", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width/2, 200, text, style);
        t.anchor.set(0.5);

        leftKey = this.add.button(this.world.width-(this.world.width/1.05), this.world.height -(this.world.width/10), "arrows", moveLeft, this, 0,0,1,0);
        rightKey = this.add.button(this.world.width-(this.world.width/1.3), this.world.height -(this.world.width/10), "arrows", moveRight, this, 2,2,3,2);
        spacebar = this.add.button(this.world.width-(this.world.width/2.8),this.world.height -(this.world.width/10), "spacebar", shootPewPews, this, 0,0,1,0);
        start = this.add.button(this.world.width-(this.world.width/1.75),this.world.height -(this.world.width/1.5),"start",0,0,1,0);
        
        spaceShooter.game.input.addPointer();
        spaceShooter.game.input.addPointer();
        spaceShooter.game.input.addPointer();

        leftKey.events.onInputDown.add(function () {
            leftKey.isDown = true;
        });

        leftKey.events.onInputUp.add(function () {
            leftKey.isDown = false;
        });

        rightKey.events.onInputDown.add(function () {
            rightKey.isDown = true;
        });

        rightKey.events.onInputUp.add(function () {
            rightKey.isDown = false;
        });

        spacebar.events.onInputDown.add(function () {
            spacebar.isDown = true;
        });

        spacebar.events.onInputUp.add(function () {
            spacebar.isDown = false;
        });
        start.events.onInputDown.add(function () {
            start.isDown = true;
        });

        start.events.onInputUp.add(function () {
            start.isDown = false;
        });


    }

  },
  update: function() {

     player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown|| leftKey.isDown)
        {
            moveLeft();
        }
         else if (cursors.right.isDown || rightKey.isDown)
        {
            moveRight();
        }
        else{
            player.animations.stop();
            player.frame = 1;
            leftKey.frame = 0;
            rightKey.frame = 2;
        }

        if (shoot.isDown || spacebar.isDown){

            shootPewPews();
            spacebar.frame = 1;
        }
        else{
          spacebar.frame = 0;
        }

    if (enterKey.isDown || start.isDown){
      this.game.state.start('game');
    }

    spaceShooter.game.debug.pointer(spaceShooter.game.input.pointer1);
    spaceShooter.game.debug.pointer(spaceShooter.game.input.pointer2);
  }
};