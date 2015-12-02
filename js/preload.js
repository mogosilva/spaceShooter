var spaceShooter = spaceShooter || {};
 
//loading the game assets
spaceShooter.preload = function(){};
 
spaceShooter.preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'loadingBar');
    this.preloadBar.anchor.setTo(0.5);

    // Space background that scrolls
    this.load.image("space", "assets/space.png");
    // spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    // Player character/ship with animations
    this.load.spritesheet("player", "assets/shipTest.png", 102, 106);
    // Enemy characters/ships with animations
    this.load.spritesheet ("enemy", "assets/baddie.png",32, 32); 
    this.load.image("bullet", "assets/diamond.png");
    this.load.image("enemyBullet", "assets/enemyDiamond.png");
    this.load.image("star", "assets/star.png");

  },

  create: function() {

    this.state.start('mainMenu');

  }
};