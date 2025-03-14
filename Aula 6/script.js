class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene"); // Inicializa a cena com a chave "MenuScene"
    }

    preload() {
        // Carrega as imagens para o botão de início e o fundo do menu
        this.load.image('startButton', 'assets/start.png');
        this.load.image('backgroundMenu', 'assets/background_menu.png');
    }

    create() {
        // Adiciona a imagem de fundo e o texto do título
        this.add.image(400, 300, 'backgroundMenu');
        this.add.text(250, 100, "Jogo do Labirinto", { fontSize: "48px", fill: "#fff" });

        // Adiciona o botão de início e o torna interativo
        let startButton = this.add.image(400, 400, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Inicia a GameScene quando o botão é clicado
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene"); // Inicializa a cena  "GameScene"
        this.score = 0; // pontuação
        this.hasKey = false; 
    }

    preload() {
        // Carrega as imagens para o jogo
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('backgroundGame', 'assets/background_game.png');
    }

    create() {
        // Adiciona a imagem de fundo =
        this.add.image(400, 300, 'backgroundGame');
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);

        // Adiciona as sprite 
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // criando a chave e a porta
        this.spawnKey();
        this.door = this.physics.add.sprite(500, 200, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);

        // Sprite do inimigo
        this.enemy = this.physics.add.sprite(400, 200, 'enemy'); //cordenadas na tela
        this.enemy.setVelocity(100, 100); //vleovidade
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        //  pontuação
        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        // Adiciona verificações de sobreposição para o jogador com a chave e o inimigo
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene'); // Inicia a GameOverScene se o jogador sobrepor com o inimigo
        });

        // Teclas pra jogabilidade
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Reseta a velocidade do jogador
        this.player.setVelocity(0);

        // Define a velocidade do jogador com base nas teclas de cursor
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    spawnKey() {
        //  gera uma nova chave em uma posição aleatória apos ser destruida
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    collectKey(player, key) {
        // Aumenta a pontuação e atualiza o texto da pontuação, destrói a chave e define o status de posse da chave
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    enterDoor(player, door) {
        // Inicia a GameScene2 se o player tiver a chave
        if (this.hasKey) {
            this.scene.start('GameScene2');
        }
    }
}

class GameScene2 extends Phaser.Scene { // Segunda fase
    constructor() {
        super("GameScene2"); 
    }

    preload() {
        // Carregando as imagens (assets)
        this.load.tilemapTiledJSON('map2', 'assets/map.json');
        this.load.image('backgroundGame2', 'assets/background_game2.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('sapo', 'assets/sapo.png');
        this.load.image('sinagoga', 'assets/sinagoga.png');
        this.load.image('balinha', 'assets/download-removebg-preview.png');
    }

    create() {
        // Adiciona a imagem de fundo e cria o tilemap
        this.add.image(400, 300, 'backgroundGame2');
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);

        // Adiciona o sprite do jogador e define sua cordenada na tela
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // Gera a chave e adiciona o sprite da porta
        this.spawnKey();
        this.door = this.physics.add.sprite(500, 200, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);

        // Adiciona o sprite do inimigo e sua posição na tela
        this.enemy = this.physics.add.sprite(400, 200, 'enemy');
        this.enemy.setVelocity(100, 100);
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        // Adiciona o texto da pontuação
        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        // Adiciona verificações de sobreposição para o jogador com a chave e o inimigo
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene'); // Inicia a GameOverScene se o jogador sobrepor com o inimigo
        });

        // Adicionado sprites do nivel 2
        this.sapinho = this.physics.add.sprite(200, 200, 'sapo');
        this.sapinho.setScale(0.2);
        this.sinagoga = this.physics.add.sprite(300, 300, 'sinagoga');
        this.sinagoga.setScale(0.2);
        this.balinha = this.physics.add.sprite(400, 400, 'balinha');
        this.balinha.setScale(0.2);

      
        this.physics.add.overlap(this.player, this.sinagoga, () => {
            this.scene.start('GameOverScene'); // Inicia a GameOverScene se o jogador sobrepor com sinagoga
        });
        this.physics.add.overlap(this.player, this.balinha, () => {
            this.scene.start('GameOverScene'); // Inicia a GameOverScene se o jogador sobrepor com balinha
        });

        // Cria teclas de cursor para o movimento do jogador
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Reseta a velocidade do jogador
        this.player.setVelocity(0);

        // Define a velocidade do jogador com base nas teclas de cursor
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    spawnKey() {
        // Destroi a chave existente, se houver, e gera uma nova chave em uma posição aleatória
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    collectKey(player, key) {
        // Aumenta a pontuação e atualiza o texto da pontuação, destrói a chave e define o status de posse da chave
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    enterDoor(player, door) {
        // Inicia a WinScene se o jogador tiver a chave
        if (this.hasKey) {
            this.scene.start('WinScene');
        }
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene"); // Inicializa a cena com a chave "GameOverScene"
    }

    preload() {
        // Carrega a imagem de fundo para a tela de game over
        this.load.image('backgroundGameOver', 'assets/background_gameover.png');
    }

    create() {
        // Adiciona a imagem de fundo e o texto de game over
        this.add.image(400, 300, 'backgroundGameOver');
        this.add.text(300, 100, "Game Over", { fontSize: "48px", fill: "#f00" });

        // Reinicia o jogo quando a tela é clicada
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene"); // Inicializa a cena com a chave "WinScene"
    }

    preload() {
       
        this.load.image('backgroundWin', 'assets/background_win.png');
    }

    create() {
        // imagem de fundo +  texto de vitória
        this.add.image(400, 300, 'backgroundWin');
        this.add.text(300, 100, "Você Ganhou!", { fontSize: "48px", fill: "#0f0" });

        // Reinicia o jogo quando a tela é clicada
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800, // Largura do jogo
    height: 600, // Altura do jogo
    physics: { default: 'arcade', arcade: { debug: false } }, // Física arcade sem debug
    scene: [MenuScene, GameScene, GameScene2, GameOverScene, WinScene] // Lista de cenas
};

const game = new Phaser.Game(config); // Phaser 