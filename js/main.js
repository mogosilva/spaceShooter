var game = new Phaser.Game(800, 600, Phaser.AUTO, "gameScreen", { preload: preload, create: create, update: update });

var space;
var player;
var enemies;
var cursors;
var shoot;
var pewPews;
var pewTime = 0;

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

function preload() {

    // Space background that scrolls
    game.load.image("space", "assets/space.png");

    // spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    // Player character/ship with animations
    game.load.spritesheet("player", "assets/shipTest.png", 102, 106);

    // Enemy characters/ships with animations
    game.load.spritesheet ("enemy", "assets/baddie.png",32, 32); 

    game.load.image("bullet", "assets/diamond.png");

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

    cursors = game.input.keyboard.createCursorKeys();
    shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    //scrolls the "space" background
    space.tilePosition.y += 3;

    //this resets the player's movements
    //if this wasn't here the player would continue to move in the direction they pressed even if they aren't pressing a key
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

            game.physics.arcade.overlap(pewPews, enemies, collisionHandler, null, this);

}

// Check if bullet collision collides with enemy collision

function collisionHandler (pew, enemy){

    pew.kill();
    enemy.kill();

}

function shootPewPews () {

    // Have the player only shoot once either the bullet has left the screen OR once it has hit an enemy
    if (game.time.now > pewTime) {

        pew = pewPews.getFirstExists(false);

        if (pew){

        pew.reset(player.x, player.y +8);
        pew.body.velocity.y = -400;
        pewTime = game.time.now + 200;
        }

    }
}
function resetPew (pew) {
    pew.kill();
}