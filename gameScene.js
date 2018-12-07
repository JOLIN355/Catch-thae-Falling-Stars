let highScore = 0;

function gameScene() {
    function preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('background', 'assets/background.png')
        this.load.spritesheet('dude', 'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.audio('coin', 'assets/coin.wav')
        this.load.audio('explosion', 'assets/explosion.mp3')
        this.load.audio('jump', 'assets/sfx_interact.mp3')
        this.load.audio('bombspawn', 'assets/siren.wav')
    }
    
    var platforms;
    var player;
    var player2;
    var cursors;
    var cursors2;
    var stars;
    var score;
    var scoreText;
    var highScoreText;
    var bombs;
    var bombsToSpawn;
    var midpoint;
    
    function create() {
        this.physics.world.setBounds(0, 0, 2400, 600);


        score = 0;
        bombsToSpawn = 0;
        this.add.image(400, 300, 'background').setScale(4.2);
        this.add.image(1450, 300, 'background').setScale(4.2);
        this.add.image(2500, 300, 'background').setScale(4.2);
       
    
        platforms = this.physics.add.staticGroup();
    
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(1200, 568, 'ground').setScale(2).refreshBody();
        platforms.create(2000, 568, 'ground').setScale(2).refreshBody();

    
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        platforms.create(850, 220, 'ground');
        platforms.create(1400, 400, 'ground');
        platforms.create(1550, 270, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player2 = this.physics.add.sprite(100, 450, 'dude');
        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);

        const camera = this.cameras.main;

        midpoint = this.physics.add.sprite(0, 0);
        camera.startFollow(midpoint)
        camera.setBounds(0, 0, 2400, 600);
    
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        cursors = this.input.keyboard.createCursorKeys();

        cursors2 = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: { x: 12, y: 0, stepX: 300 }
        });
    
        stars.children.iterate(function (child) {
    
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
        });
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        highScoreText = this.add.text(16, 48, `highScore: ${highScore}`, { fontSize: '32px', fill: '#000' });
    
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, platforms);
        this.physics.add.overlap(player2, stars, collectStar, null, this);
        this.physics.add.collider(player2, platforms);
    
        bombs = this.physics.add.group();
    
        this.physics.add.collider(bombs, platforms);
    
        this.physics.add.collider(player, bombs, hitBomb, null, this);
        this.physics.add.collider(player2, bombs, hitBomb, null, this);

        
    
    }
    
    
    function update() {
    
    
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
    
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
    
            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);
    
            player.anims.play('turn');
        }
    
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }

        if (cursors2.left.isDown) {
            player2.setVelocityX(-160);
    
            player2.anims.play('left', true);
        }
        else if (cursors2.right.isDown) {
            player2.setVelocityX(160);
    
            player2.anims.play('right', true);
        }
        else {
            player2.setVelocityX(0);
    
            player2.anims.play('turn');
        }
    
        if (cursors2.up.isDown && player2.body.touching.down) {
            player2.setVelocityY(-330);
        }

        const distanceY = Math.abs(player.y - player2.y);
        const distanceX = Math.abs(player.x - player2.x);
        const midX = Math.min(player.x, player2.x) + distanceX/2;
        const midY = Math.min(player.y, player2.y) + distanceY/2;

        midpoint.x = midX;
        midpoint.y = midY;

        const distance = Math.sqrt(distanceY**2 + distanceX**2)
        const normDistance = Math.min(distance, 400);
        const zoom = 1.1*(400 - normDistance)/500;


        const camera = this.cameras.main;
        camera.setZoom(zoom+1)
        /*
        if (distance <  300) {
            camera.setZoom(2)
        } 
        else {
            camera.setZoom(1)
        }
        */
    }
    
    function collectStar(player, star) {
        star.disableBody(true, true);
        this.sound.play('coin')
    
        score += 10;
        if(score > highScore) {
            highScore = score
        }
        highScoreText.setText('highScore: ' + highScore);
        scoreText.setText('Score: ' + score);
    
        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            bombsToSpawn++;
            this.sound.play('bombspawn')
            for (let i = 0; i < bombsToSpawn; i++) {
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            }
        }
    }
    
    function hitBomb(player, bomb) {
        if(player.body.touching.down && bomb.body.touching.up) {
            bomb.destroy();
            score += 10;
            if(score > highScore) {
                highScore = score
            }
            
            highScoreText.setText('highScore: ' + highScore);
            scoreText.setText('Score: ' + score);
            this.sound.play('jump')
            
        } else{
        this.sound.play('explosion')
    
        this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play('turn');
        player2.anims.play('turn');

    
        gameOver = true;

        this.scene.start("game")
        }
        
    }

    return {
        preload,
        create,
        update
    }
}