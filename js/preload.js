var spaceShooter = spaceShooter || {};
 
//loading the game assets
spaceShooter.preload = function(){};
 
spaceShooter.preload.prototype = {

  preload: function() {

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

  create: function() {

    //  Arcade Physics system enables...physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('mainMenu');

  }
};