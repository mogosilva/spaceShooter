var game = new Phaser.Game(800, 600, Phaser.AUTO, "gameScreen", { preload: preload, create: create, update: update });

var space;
var player;
var enemies;
var cursors;
var shoot;
var pewPews;
var playerFireTimer = 0;
var enemyFireTimer = 0;
var enemyPew;
var livingEnemies = [];

function createEnemies () {

        for (var y=0; y < 4; y++){

            for (var x=0; x<10; x++){

                var enemy = enemies.create(x*48, y*50, "enemy");
                enemy.anchor.setTo(0.02, 0.5);
               enemy.animations.add("fly",[0,1],5, true);
               enemy.play("fly");
                enemy.body.moves = false;

            }
        }

        enemies.x = 100;
        enemies.y = 50;

        var tween = game.add.tween(enemies).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        tween.onLoop.add(descend, this);

    }

    function descend() {

    enemies.y += 10;

}

// Check if bullet collision collides with enemy collision

function collisionPBulletAndEnemy (pew, enemy){

    pew.kill();
    enemy.kill();

}

// If enemy collides with player, both die.

function collisionPlayerAndEnemy (player, enemy){

    player.kill();
    enemy.kill();

}

function collisionPlayerAndEnemyBullet (player, enemyPew){

    player.kill();
    enemyPew.kill();


}

function shootPewPews () {

    // Have the player only shoot once either the bullet has left the screen OR once it has hit an enemy
    
    if (game.time.now > playerFireTimer) {

        pew = pewPews.getFirstExists(false);

        if (pew){

        pew.reset(player.x, player.y +8);
        pew.body.velocity.y = -400;
        playerFireTimer = game.time.now + 500;
        }

    }
}

function enemyShootsPewPews () {

    enemyPew = enemyPews.getFirstExists(false);
    livingEnemies.length= 0;

    enemies.forEachAlive(function(enemy){

        livingEnemies.push(enemy);
    })

    if (enemyPew && livingEnemies.length > 0){

        var random = game.rnd.integerInRange(0,livingEnemies.length-1);
        var shooter = livingEnemies[random];
        enemyPew.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyPew,player,300);
        enemyFireTimer = game.time.now + 1500;


    }

}

function resetPew (pew) {
    pew.kill();
}

function resetEnemyPew (enemyPew) {
    enemyPew.kill();
}


function preload() {

    // Space background that scrolls
    game.load.image("space", "assets/space.png");

    // spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    // Player character/ship with animations
    game.load.spritesheet("player", "assets/shipTest.png", 102, 106);

    // Enemy characters/ships with animations
    game.load.spritesheet ("enemy", "assets/baddie.png",32, 32); 

    game.load.image("bullet", "assets/diamond.png");
    game.load.image("enemyBullet", "assets/enemyDiamond.png");

}

function create() {

    //  Arcade Physics system enables...physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //TileSprite format:
    //TileSprite(game, x, y, width, height, key, frame)
    space = game.add.tileSprite(0,0,800,600, "space");

    //player and player bullets
    player = game.add.sprite(game.world.width-468, game.world.height -150, "player");
    player.animations.add("left",[0],10,true);
    player.animations.add("right",[2],10,true);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    pewPews = game.add.group();
    pewPews.enableBody = true;
    pewPews.physicsBodyType = Phaser.Physics.ARCADE;
    pewPews.createMultiple(10, "bullet");
    pewPews.setAll("anchor.x",-1.15);
    pewPews.setAll("anchor.y",1);
    pewPews.setAll("outOfBoundsKill", true);
    pewPews.setAll("checkWorldBounds",true);


    //enemy and enemy bullets
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();

    enemyPews = game.add.group();
    enemyPews.enableBody = true;
    enemyPews.physicsBodyType = Phaser.Physics.ARCADE;
    enemyPews.createMultiple(30, "enemyBullet");
    enemyPews.setAll("anchor.x", 0);
    enemyPews.setAll("anchor.y", -1);
    enemyPews.setAll("outOfBoundsKill", true);
    enemyPews.setAll("checkWorldBounds", true);

    //Player controls
    cursors = game.input.keyboard.createCursorKeys();
    shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

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

        if (game.time.now > enemyFireTimer){

            enemyShootsPewPews();
        }

            game.physics.arcade.overlap(pewPews, enemies, collisionPBulletAndEnemy, null, this);
            game.physics.arcade.overlap(player, enemies, collisionPlayerAndEnemy, null, this);
            game.physics.arcade.overlap(player, enemyPews, collisionPlayerAndEnemyBullet, null, this);

    }

}