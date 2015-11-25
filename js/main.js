var game = new Phaser.Game(800, 600, Phaser.AUTO, "gameScreen", { preload: preload, create: create, update: update });

var space;
var player;
var enemy;
var cursors;
var shoot;


function preload() {

    // Space background that scrolls
    game.load.image("space", "assets/space.png");

    // spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    // Player character/ship with animations
    game.load.spritesheet("player", "assets/shipTest.png", 102, 106);

    // Enemy characters/ships with animations
    game.load.spritesheet ("enemy", "assets/baddie.png",32, 34); 

}

function create() {

    //  Arcade Physics system enables...physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //TileSprite format:
    //TileSprite(game, x, y, width, height, key, frame)
    space = game.add.tileSprite(0,0,800,600, "space");

    player = game.add.sprite(game.world.width-468, game.world.height -150, "player");
    player.animations.add("left",[0],10,true);
    player.animations.add("right",[2],10,true);
    game.physics.enable(player, Phaser.Physics.ARCADE);



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

        // Have the player only shoot once either the bullet has left the screen OR once it has hit an enemy

        // Check if bullet collision collides with enemy collision


}