var spaceShooter = spaceShooter || {};

spaceShooter.mainMenu = function(){};

var enterKey;

spaceShooter.mainMenu.prototype = {

  create: function() {
   
   this.add.sprite(0,0, "space");
    var text = "Press ENTER to begin";
    var style = { font: "30px Lato", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);
    enterKey = spaceShooter.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  },
  update: function() {

    if (enterKey.isDown){
      this.game.state.start('game');
  }
  }
};