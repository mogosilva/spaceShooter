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

	gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.

    },

    enterIncorrectOrientation: function () {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }
};