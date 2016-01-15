var spaceShooter = spaceShooter || {

	    orientated: false
};

spaceShooter.boot = function () {};

spaceShooter.boot.prototype = {
	
    init: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

         if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 400;
            this.scale.minHeight = 300;
            this.scale.maxWidth = 800;
            this.scale.maxHeight = 600;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.refresh();
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 400;
            this.scale.minHeight = 300;
            this.scale.maxWidth = 800;
            this.scale.maxHeight = 600;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.scale.refresh();
        }

    },

	preload: function(){
		this.load.image("loadingBar", "assets/loadingBar.png");
	},

	create: function(){

		//this.scale.updateLayout(true);

		//  Arcade Physics system enables...physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.state.start("preload");
	},

    enterIncorrectOrientation: function () {

        spaceShooter.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        spaceShooter.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    },

   /* if (spaceShooter.orientated == false) {
        
        spaceShooter.game.paused = true;

    }else{

        spaceShooter.game.paused = false;

    }
    */




};