var spaceShooter = spaceShooter || {};

spaceShooter.theGame =function(){};


var enemies;
var playerFireTimer = 0;
var enemyFireTimer = 0;
var timer = 5;
var enemyPew;
var livingEnemies = [];
var stateText;
var tween;
var emitter;
var score = 0;
var scoreString = "";
var scoreText;
var highScore = 0;
var highScoreString = "";
var highScoreText;
var enemy;
var continues;
var restarts;


function createEnemies () {

    for (var y=0; y < 3; y++){

        for (var x=0; x<10; x++){

            enemy = enemies.create(x*48, y*50, "enemy");
            enemy.anchor.setTo(0.02, 0.5);
            enemy.animations.add("flyLeft",[0,1],5, true);
            enemy.animations.add("flyRight",[2,3],5, true);
            enemy.animations.play("flyRight");
            enemy.body.moves = false;
        }
    }

    enemies.x = 100;
    enemies.y = 100;

    tween = spaceShooter.game.add.tween(enemies).to( { x: 200 }, (2000-(score*0.4)), Phaser.Easing.Linear.None, true, 0, 100, true);
    tween.onLoop.add(descend, enemies);

}

function descend() {

    console.log("Descend");
    enemies.y += 10;

}

//Player is dead Game Over man...
function playerDeath () {

    enemyPews.callAll("kill", this);
    pewPews.callAll("kill", this);
    leftKey.visible=false;
    rightKey.visible=false;
    spacebar.visible=false;

    if (score>highScore){

            highScore=score;
            highScoreText.text=highScoreString + highScore;
            
            if (spaceShooter.game.device.desktop){
                stateText.text = "            GAME OVER \n      NEW HIGH SCORE\npress [ENTER] to restart";
            } else{
                stateText.text = "            GAME OVER \n      NEW HIGH SCORE";
                restarts.visible=true;
             }

        }else{
            if(spaceShooter.game.device.desktop){
                stateText.text = "            GAME OVER \npress [ENTER] to restart";
            }else{
                stateText.text = "            GAME OVER";
                restarts.visible=true;
            }
        }

    score = 0;
    stateText.visible = true;
    //Press enter to restart the game
    if(spaceShooter.game.device.desktop){
        enterKey.onDown.addOnce(restart, spaceShooter.game);
        }else{
            restarts.onInputDown.addOnce(restart, spaceShooter.game);
        }
    //If player dies, total score is reset to 0
    score = 0;
    scoreText.text = scoreString + score;

}

function resetPew (pew) {
    pew.kill();
}

function resetEnemyPew (enemyPew) {
    enemyPew.kill();
}

function restart () {

    //bring back enemies
    enemies.removeAll();
    spaceShooter.game.time.reset();
    tween.onLoop.remove(descend, enemies);
    createEnemies();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}

function explode (enemy){

    emitter.x = enemy.body.x;
    emitter.y = enemy.body.y;
    emitter.start(true, 1000, null, 5);
}

function playerExplode (player){

    emitter.x = player.body.x;
    emitter.y = player.body.y;
    emitter.start(true, 2000, null, 20);
}


/**********************************************************************************************
    FIRING FUNCTIONS
**********************************************************************************************/


// Enemy fire
function enemyShootsPewPews () {

    enemyPew = enemyPews.getFirstExists(false);
    livingEnemies.length= 0;

    enemies.forEachAlive(function(enemy){

        livingEnemies.push(enemy);
    })

    if (enemyPew && livingEnemies.length > 0){

        var random = spaceShooter.game.rnd.integerInRange(0,livingEnemies.length-1);
        var shooter = livingEnemies[random];
        enemyPew.reset(shooter.body.x, shooter.body.y);

        spaceShooter.game.physics.arcade.moveToObject(enemyPew,player,300);

        //Making it so that the fire rate isn't increased on the first level
        if (timer<5){

            enemyFireTimer = spaceShooter.game.time.now + 2000 - (score*0.65);

        }else{

        enemyFireTimer = spaceShooter.game.time.now + 2000;

        }

    }

}

/**********************************************************************************************
    COLLISION FUNCTIONS
**********************************************************************************************/

// If enemy collides with player, both die

function collisionPlayerAndEnemy (player, enemy){

    playerExplode(player);
    player.kill();
    explode(enemy);
    enemy.kill();
    playerDeath();

}

// If enemy bullet collides with player, bullet and player die
function collisionPlayerAndEnemyBullet (player, enemyPew){

    playerExplode(player);
    player.kill();
    enemyPew.kill();
    playerDeath();

}

// If player's bullet (pew) collides with enemy, enemy dies

function collisionPBulletAndEnemy (pew, enemy){

    pew.kill();
    explode(enemy);
    enemy.kill();

    score += 20;
    scoreText.text = scoreString + score;

    if (enemies.countLiving() == 0)
    {
        scoreText.text = scoreString + score;

        if (score>highScore){
            highScore=score;
            highScoreText.text=highScoreString + highScore;
            
            if(spaceShooter.game.device.desktop){
                stateText.text = "                 You Won!\n       NEW HIGH SCORE\nPress [ENTER] to Continue";
            }else{
                stateText.text = "                 You Won!\n       NEW HIGH SCORE";
                continues.visible=true;
            }
        }else{
            if(spaceShooter.game.device.desktop){
            stateText.text = "                 You Won!\nPress [ENTER] to Continue";
            }else{
                stateText.text = "                 You Won!";
                continues.visible=true;
            }
        }

        enemyPews.callAll('kill',this);
        stateText.visible = true;

        //Decrease enemy shooter timer per level
        if (timer>0) {

            timer-=1;
        };

        //the "click to restart" handler
        if(spaceShooter.game.device.desktop){
        enterKey.onDown.addOnce(restart, spaceShooter.game);
        }else{
            continues.onInputDown.addOnce(restart, spaceShooter.game)
        }
        //If player wins, player score stays so they continue to increase their high score!
    }

}
/**********************************************************************************************
    PHASER MAIN JS
**********************************************************************************************/
spaceShooter.theGame.prototype = {

create: function() {

    //TileSprite format:
    //TileSprite(game, x, y, width, height, key, frame)
    space = this.add.tileSprite(0,0,800,600, "space");

    spaceShooter.game.time.reset();

    //player and player bullets
    player = this.add.sprite(this.world.width-(this.world.width/1.8), this.world.height -(this.world.height/2.9), "player");
    player.animations.add("left",[0],10,true);
    player.animations.add("right",[2],10,true);
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.width = 50;
    player.body.height = 40;
    player.body.offset.x = 25;
    player.body.offset.y = 45;

    pewPews = this.add.group();
    pewPews.enableBody = true;
    pewPews.physicsBodyType = Phaser.Physics.ARCADE;
    pewPews.createMultiple(10, "bullet");
    pewPews.setAll("anchor.x",-1.15);
    pewPews.setAll("anchor.y",1);
    pewPews.setAll("outOfBoundsKill", true);
    pewPews.setAll("checkWorldBounds",true);


    //enemy and enemy bullets
    enemies = this.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();

    enemyPews = spaceShooter.game.add.group();
    enemyPews.enableBody = true;
    enemyPews.physicsBodyType = Phaser.Physics.ARCADE;
    enemyPews.createMultiple(30, "enemyBullet");
    enemyPews.setAll("anchor.x", 0);
    enemyPews.setAll("anchor.y", -1);
    enemyPews.setAll("outOfBoundsKill", true);
    enemyPews.setAll("checkWorldBounds", true);

    //Text
    stateText = spaceShooter.game.add.text(spaceShooter.game.world.centerX,spaceShooter.game.world.centerY,' ', { 
        font: "Lato",
        fontWeight: "400",
        fontSize: "40px",
        fill: "#fff" 
    });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    //Player controls
    cursors = spaceShooter.game.input.keyboard.createCursorKeys();
    shoot = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    enterKey = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    //Explosions?!?
    emitter = spaceShooter.game.add.emitter(0,0,100);
    emitter.makeParticles("star");
    emitter.gravity = 0;

    //  current game score
    scoreString = 'Score : ';
    scoreText = spaceShooter.game.add.text(10, 10, scoreString + score, { font: "Lato", fontSize: "20px", fill: "#fff" });

    // high score
    highScoreString = "High Score : ";
    highScoreText = spaceShooter.game.add.text(600, 10, highScoreString+highScore, { font: "Lato", fontSize: "20px", fill: "#fff" });

    if (!spaceShooter.game.device.desktop){
        leftKey = this.add.button(this.world.width-(this.world.width/1.05), this.world.height -(this.world.width/10), "arrows", moveLeft, this, 0,0,1,0);
        rightKey = this.add.button(this.world.width-(this.world.width/1.3), this.world.height -(this.world.width/10), "arrows", moveRight, this, 2,2,3,2);
        spacebar = this.add.button(this.world.width-(this.world.width/2.8),this.world.height -(this.world.width/10), "spacebar", shootPewPews, this, 0,0,1,0);
        continues = this.add.button(this.world.width-(this.world.width/1.75),this.world.height -(this.world.width/3.2),"continues",0,0,1,0);
        restarts = this.add.button(this.world.width-(this.world.width/1.75),this.world.height -(this.world.width/3.2),"restart",0,0,1,0);

        leftKey.inputEnabled = true;
        rightKey.inputEnabled = true;
        spacebar.inputEnabled = true;

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

    }
},

update: function() {


    //scrolls the "space" background  
    space.tilePosition.y += 3;

    //this resets the player's movements
    //if this wasn't here the player would continue to move in the direction they pressed even if they aren't pressing a key
    
    if (player.alive){
    
        player.body.velocity.setTo(0, 0);

        //If player is alive show buttons
        //This only displays on mobile devices
        if(!spaceShooter.game.device.desktop){
            
            leftKey.visible=true;
            rightKey.visible=true;
            spacebar.visible=true;
            restarts.visible=false;

            if(player.alive && enemies.countLiving() != 0){
                continues.visible=false;
            } 
        }

        if (cursors.left.isDown||leftKey.isDown)
        {
            //if left arrow key is down, move the player in the negative X direction
            //Player speed increase as score increases
            player.body.velocity.x = -200-(score*0.05);
            player.animations.play("left");
        }
        else if (cursors.right.isDown||rightKey.isDown)
        {
            //if right arrow key is down, move the player in the negative X direction
            //Player speed increase as score increases
            player.body.velocity.x = 200+(score*0.05);
            player.animations.play("right");
        }
        else{

            player.animations.stop();
            player.frame = 1;
        }

        // When the player presses the SPACEBAR fire a bullet
        if (shoot.isDown||spacebar.isDown){

            shootPewPews();
        }
        //Allow some time at the beginning of the round before enemies begin firing
        if (spaceShooter.game.time.totalElapsedSeconds() > timer){

            if (spaceShooter.game.time.now > enemyFireTimer){

                enemyShootsPewPews();
            }
        }



        // Runs a function depending on what objects overlap
        spaceShooter.game.physics.arcade.overlap(pewPews, enemies, collisionPBulletAndEnemy, null, this);
        spaceShooter.game.physics.arcade.overlap(player, enemies, collisionPlayerAndEnemy, null, this);
        spaceShooter.game.physics.arcade.overlap(player, enemyPews, collisionPlayerAndEnemyBullet, null, this);

    }

},

/*
    render: function () {

        // Used to debug player hitbox
        spaceShooter.game.debug.body(player);

    },
*/
}