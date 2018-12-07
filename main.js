var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade', arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

game.scene.add("game", gameScene());
game.scene.add("start", startscene());
game.scene.start("start")