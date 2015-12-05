var spaceShooter = spaceShooter || {};

spaceShooter.boot = function () {};

spaceShooter.boot.prototype = {
	

	preload: function(){
		this.load.image("loadingBar", "assets/loadingBar.png");
	},
	create: function(){

		//this.scale.updateLayout(true);

		//  Arcade Physics system enables...physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.state.start("preload");
	},

};