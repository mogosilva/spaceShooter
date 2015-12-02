var spaceShooter = spaceShooter || {};

spaceShooter.boot = function () {};

spaceShooter.boot.prototype = {
	
	preload: function(){
		this.load.image("loadingBar", "assets/loadingBar.png");
	},
	create: function(){

		this.game.stage.backgroundColor = "#1d1d1c";
		this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.maxWidth = 800;
		this.scale.maxHeight = 600;
		this.scale.pageAlignHorizontally = true;
		this.scale.updateLayout(true);

		//  Arcade Physics system enables...physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.state.start("preload");
	}
};