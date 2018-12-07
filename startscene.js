function startscene() {
    let keys
    function preload() {
        this.load.image('startscreen', 'assets/Start.jpg')

    }
    function create() {
        keys = this.input.keyboard.addKeys({
            start: Phaser.Input.Keyboard.KeyCodes.ENTER
        });
        this.add.image(400, 300, 'startscreen').setScale(1);
    }
    function update() {
        if (keys.start.isDown) {
            this.scene.start("game")
        }
    }
    return {
        preload,
        create,
        update
    }
}