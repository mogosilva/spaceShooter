var spaceShooter = spaceShooter || {};
/*
var w = window.innerWidth * window.devicePixelRatio;
var h = window.innerHeight * window.devicePixelRatio;
spaceShooter.game = new Phaser.Game(w, h, Phaser.AUTO, "gameScreen");
*/
spaceShooter.game = new Phaser.Game(800, 600, Phaser.AUTO);
// For collision testing change Phaser.AUTO to Phaser.CANVAS

spaceShooter.game.state.add("boot", spaceShooter.boot);
spaceShooter.game.state.add("preload", spaceShooter.preload);
spaceShooter.game.state.add("mainMenu", spaceShooter.mainMenu);
spaceShooter.game.state.add("game", spaceShooter.theGame);
 
spaceShooter.game.state.start("boot");
