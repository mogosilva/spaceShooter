var spaceShooter = spaceShooter || {};

spaceShooter.theGame =function(){};

var space;
var player;
var enemies;
var cursors;
var shoot;
var pewPews;
var playerFireTimer = 0;
var enemyFireTimer = 0;
var timer = 5;
var enemyPew;
var livingEnemies = [];
var stateText;
var tween;
var enterKey;
var emitter;


function createEnemies () {

        for (var y=0; y < 3; y++){

            for (var x=0; x<10; x++){

                var enemy = enemies.create(x*48, y*50, "enemy");
                enemy.anchor.setTo(0.02, 0.5);
                enemy.animations.add("fly",[0,1],5, true);
                enemy.play("fly");
                enemy.body.moves = false;

            }
        }

        enemies.x = 100;
        enemies.y = 100;

        tween = spaceShooter.game.add.tween(enemies).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 100, true);

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
    stateText.text = "            GAME OVER \npress [ENTER] to restart";
    stateText.visible = true;

    //Press enter to restart the game
        enterKey.onDown.addOnce(restart, spaceShooter.game);

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

function explode (object){

    emitter.x = object.body.x;
    emitter.y = object.body.y;
    emitter.start(true, 1000, null, 5);
}

/**********************************************************************************************
    FIRING FUNCTIONS
**********************************************************************************************/

// Player fire
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
        enemyFireTimer = spaceShooter.game.time.now + 2000;


    }

}

/**********************************************************************************************
    COLLISION FUNCTIONS
**********************************************************************************************/

// If enemy collides with player, both die

function collisionPlayerAndEnemy (player, enemy){

    explode(player);
    player.kill();
    explode(enemy);
    enemy.kill();
    playerDeath();

}

// If enemy bullet collides with player, bullet and player die
function collisionPlayerAndEnemyBullet (player, enemyPew){

    explode(player);
    player.kill();
    enemyPew.kill();
    playerDeath();


}

// If player's bullet (pew) collides with enemy, enemy dies

function collisionPBulletAndEnemy (pew, enemy){

    pew.kill();
    explode(enemy);
    enemy.kill();

    if (enemies.countLiving() == 0)
    {

        enemyPews.callAll('kill',this);
        stateText.text = "                 You Won!\n Press [ENTER] to restart";
        stateText.visible = true;

        //the "click to restart" handler
        enterKey.onDown.addOnce(restart, game);
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

    //player and player bullets
    player = this.add.sprite(this.world.width-468, this.world.height -150, "player");
    player.animations.add("left",[0],10,true);
    player.animations.add("right",[2],10,true);
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

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

},

update: function() {


    //scrolls the "space" background
    space.tilePosition.y += 3;

    //this resets the player's movements
    //if this wasn't here the player would continue to move in the direction they pressed even if they aren't pressing a key
    
    if (player.alive){
    
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
            player.animations.play("left");
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
            player.animations.play("right");
        }
        else{
            player.animations.stop();
            player.frame = 1;
        }

        // When the player presses the SPACEBAR fire a bullet

        if (shoot.isDown){

            shootPewPews();
        }

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

}