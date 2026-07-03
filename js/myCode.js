class Cell extends Sprite {
    constructor(state, row, col, size, x, y, type) {
        super();
        this.state = state;
        this.row = row;
        this.col = col;
        this.size = size;
        this.x = x;
        this.y = y;
        this.type = type;
        this.towerType = '';
    }

    update(sprites, keys, mouse) {
        if (this.state.gameOver || this.state.win) {
            return false;
        }

        if (
            mouse.clicked &&
            this.type === 'G' &&
            this.x <= mouse.x && mouse.x <= this.x + this.size &&
            this.y <= mouse.y && mouse.y <= this.y + this.size
        ) {
            this.state.placeTower(this);
            mouse.clicked = false;
        }

        return false;
    }

    render(ctx) {
        switch (this.type) {
            case 'G':
                ctx.fillStyle = '#3a7d44';
                break;
            case 'P':
                ctx.fillStyle = '#d2b48c';
                break;
            case 'S':
                ctx.fillStyle = '#4dabf7';
                break;
            case 'E':
                ctx.fillStyle = '#ff6b6b';
                break;
            case 'B':
                ctx.fillStyle = '#495057';
                break;
            default:
                ctx.fillStyle = '#222';
                break;
        }

        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeStyle = '#111';
        ctx.strokeRect(this.x, this.y, this.size, this.size);
    }
}

class Tower extends Sprite {
    constructor(state, cell, type) {
        super();
        this.state = state;
        this.cell = cell;
        this.type = type;
        this.x = cell.x + cell.size / 2;
        this.y = cell.y + cell.size / 2;
        this.cooldown = 0;
        this.range = 0;
        this.fireDelay = 0;
        this.damage = 0;
        this.color = '';

        switch (this.type) {
            case 'basic':
                this.range = 120;
                this.fireDelay = 40;
                this.damage = 20;
                this.color = '#ffd43b';
                break;
            case 'sniper':
                this.range = 230;
                this.fireDelay = 95;
                this.damage = 50;
                this.color = '#74c0fc';
                break;
            case 'rapid':
                this.range = 100;
                this.fireDelay = 14;
                this.damage = 9;
                this.color = '#ff922b';
                break;
        }
    }

    update(sprites, keys, mouse) {
        if (this.state.gameOver || this.state.win) {
            return false;
        }

        if (this.cooldown > 0) {
            this.cooldown--;
        }

        if (this.cooldown <= 0) {
            let target = null;
            let bestProgress = -1;

            for (let i = 0; i < this.state.enemies.length; i++) {
                let enemy = this.state.enemies[i];

                if (!enemy.alive) {
                    continue;
                }

                let dx = enemy.x - this.x;
                let dy = enemy.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= this.range) {
                    if (enemy.pathIndex > bestProgress) {
                        bestProgress = enemy.pathIndex;
                        target = enemy;
                    }
                }
            }

            if (target !== null) {
                let bullet = new Bullet(this.state, this.x, this.y, target, this.damage, this.type);
                this.state.bullets.push(bullet);
                this.state.game.addSprite(bullet);
                this.cooldown = this.fireDelay;
            }
        }

        return false;
    }

    render(ctx) {
        ctx.fillStyle = this.color;

        switch (this.type) {
            case 'basic':
                ctx.beginPath();
                ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'sniper':
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - 12);
                ctx.lineTo(this.x - 10, this.y + 10);
                ctx.lineTo(this.x + 10, this.y + 10);
                ctx.closePath();
                ctx.fill();
                break;
            case 'rapid':
                ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
                break;
        }

        ctx.strokeStyle = '#1f5130';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.cell.x + 8, this.cell.y + 8, this.cell.size - 16, this.cell.size - 16);
        ctx.lineWidth = 1;
    }
}

class Enemy extends Sprite {
    constructor(state, type) {
        super();
        this.state = state;
        this.type = type;
        this.pathIndex = 0;
        this.alive = true;
        this.reachedEnd = false;
        this.reward = 0;
        this.maxHp = 0;
        this.hp = 0;
        this.speed = 0;
        this.color = '';

        switch (this.type) {
            case 'normal':
                this.maxHp = 50;
                this.hp = 50;
                this.speed = 1;
                this.reward = 15;
                this.color = '#f03e3e';
                break;
            case 'fast':
                this.maxHp = 35;
                this.hp = 35;
                this.speed = 1.6;
                this.reward = 18;
                this.color = '#ff922b';
                break;
            case 'tank':
                this.maxHp = 110;
                this.hp = 110;
                this.speed = 0.7;
                this.reward = 30;
                this.color = '#845ef7';
                break;
        }

        let startPoint = this.state.pathPoints[0];
        this.x = startPoint.x;
        this.y = startPoint.y;
        this.size = 18;
    }

    update(sprites, keys, mouse) {
        if (!this.alive || this.state.gameOver || this.state.win) {
            return false;
        }

        if (this.pathIndex >= this.state.pathPoints.length - 1) {
            this.alive = false;
            this.reachedEnd = true;
            this.state.lives--;

            if (this.state.lives <= 0) {
                this.state.gameOver = true;
            }

            return false;
        }

        let nextPoint = this.state.pathPoints[this.pathIndex + 1];
        let dx = nextPoint.x - this.x;
        let dy = nextPoint.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.speed) {
            this.x = nextPoint.x;
            this.y = nextPoint.y;
            this.pathIndex++;
        } else {
            this.x += this.speed * dx / distance;
            this.y += this.speed * dy / distance;
        }

        return false;
    }

    render(ctx) {
        if (!this.alive) {
            return false;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - 12, this.y - 15, 24, 4);

        ctx.fillStyle = 'lime';
        ctx.fillRect(this.x - 12, this.y - 15, 24 * (this.hp / this.maxHp), 4);
    }
}

class Bullet extends Sprite {
    constructor(state, x, y, target, damage, towerType) {
        super();
        this.state = state;
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.alive = true;
        this.speed = 5;
        this.color = 'white';
        this.size = 4;

        switch (towerType) {
            case 'basic':
                this.color = '#fff3bf';
                this.speed = 5;
                this.size = 4;
                break;
            case 'sniper':
                this.color = '#a5d8ff';
                this.speed = 8;
                this.size = 5;
                break;
            case 'rapid':
                this.color = '#ffd8a8';
                this.speed = 6;
                this.size = 3;
                break;
        }
    }

    update(sprites, keys, mouse) {
        if (!this.alive || this.state.gameOver || this.state.win) {
            return false;
        }

        if (this.target === null || !this.target.alive) {
            this.alive = false;
            return false;
        }

        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.speed + 2) {
            this.target.hp -= this.damage;
            this.alive = false;

            if (this.target.hp <= 0 && this.target.alive) {
                this.target.alive = false;
                this.state.money += this.target.reward;
                this.state.kills++;
            }
        } else {
            this.x += this.speed * dx / distance;
            this.y += this.speed * dy / distance;
        }

        return false;
    }

    render(ctx) {
        if (!this.alive) {
            return false;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class UIButton extends Sprite {
    constructor(state, x, y, w, h, text, towerType, cost, benefit) {
        super();
        this.state = state;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.towerType = towerType;
        this.cost = cost;
        this.benefit = benefit;
    }

    update(sprites, keys, mouse) {
        if (this.state.gameOver || this.state.win) {
            return false;
        }

        if (
            mouse.clicked &&
            this.x <= mouse.x && mouse.x <= this.x + this.w &&
            this.y <= mouse.y && mouse.y <= this.y + this.h
        ) {
            this.state.selectedTowerType = this.towerType;
            mouse.clicked = false;
        }

        return false;
    }

    render(ctx) {
        if (this.state.selectedTowerType === this.towerType) {
            ctx.fillStyle = '#ffd43b';
        } else {
            ctx.fillStyle = '#dee2e6';
        }

        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = '#111';
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.fillStyle = 'black';
        ctx.font = '13px Arial';
        ctx.fillText(this.text + ' ($' + this.cost + ')', this.x + 8, this.y + 16);

        ctx.font = '10px Arial';
        ctx.fillText(this.benefit, this.x + 8, this.y + 30);
    }
}

class UIText extends Sprite {
    constructor(state, x, y, kind) {
        super();
        this.state = state;
        this.x = x;
        this.y = y;
        this.kind = kind;
    }

    update(sprites, keys, mouse) {
        return false;
    }

    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';

        switch (this.kind) {
            case 'money':
                ctx.fillText('Money: ' + this.state.money, this.x, this.y);
                break;
            case 'lives':
                ctx.fillText('Lives: ' + this.state.lives, this.x, this.y);
                break;
            case 'wave':
                ctx.fillText('Wave: ' + this.state.wave + '/' + this.state.maxWaves, this.x, this.y);
                break;
            case 'kills':
                ctx.fillText('Kills: ' + this.state.kills, this.x, this.y);
                break;
            case 'selected':
                ctx.fillText('Selected: ' + this.state.selectedTowerType, this.x, this.y);
                break;
        }
    }
}

class EndLabel extends Sprite {
    constructor(state) {
        super();
        this.state = state;
    }

    update(sprites, keys, mouse) {
        return false;
    }

    render(ctx) {
        if (this.state.gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = '#ff6b6b';
            ctx.font = '40px Arial';
            ctx.fillText('GAME OVER', 150, 300);
        }

        if (this.state.win) {
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = '#8ce99a';
            ctx.font = '40px Arial';
            ctx.fillText('YOU WIN', 190, 300);
        }
    }
}

class UIPanel extends Sprite {
    constructor(state) {
        super();
        this.state = state;
    }

    update(sprites, keys, mouse) {
        return false;
    }

    render(ctx) {
        ctx.fillStyle = '#111';
        ctx.fillRect(600, 0, 200, 600);

        ctx.fillStyle = 'white';
        ctx.font = '22px Arial';
        ctx.fillText('Tower Defense', 615, 30);

        ctx.font = '16px Arial';
        ctx.fillText('Select a tower:', 615, 50);

        ctx.font = '13px Arial';
        ctx.fillText('Only green cells are clickable', 610, 420);

        ctx.fillStyle = '#ffd43b';
        ctx.beginPath();
        ctx.arc(628, 465, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText('Basic = balanced', 648, 470);

        ctx.fillStyle = '#74c0fc';
        ctx.beginPath();
        ctx.moveTo(628, 490);
        ctx.lineTo(618, 510);
        ctx.lineTo(638, 510);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText('Sniper = range + damage', 648, 505);

        ctx.fillStyle = '#ff922b';
        ctx.fillRect(618, 525, 20, 20);
        ctx.fillStyle = 'white';
        ctx.fillText('Rapid = fast shooting', 648, 540);
    }
}

class GameState extends Sprite {
    constructor(game) {
        super();
        this.game = game;

        this.backgroundMusic = new Audio('assets/sounds/Background-Music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.7;

        window.addEventListener('click', () => {
            this.backgroundMusic.play().catch(() => {});
        }, { once: true });

        this.cellSize = 60;
        this.rows = 10;
        this.cols = 10;

        this.money = 140;
        this.lives = 10;
        this.wave = 0;
        this.maxWaves = 5;
        this.kills = 0;

        this.selectedTowerType = 'basic';
        this.gameOver = false;
        this.win = false;
        this.overlayAdded = false;

        this.spawningWave = false;
        this.waveDelay = 120;
        this.spawnTimer = 0;
        this.enemiesToSpawn = 0;

        this.cells = [];
        this.towers = [];
        this.enemies = [];
        this.bullets = [];

        this.map = [
            ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
            ['S', 'P', 'P', 'P', 'P', 'P', 'G', 'G', 'G', 'G'],
            ['G', 'G', 'G', 'G', 'G', 'P', 'G', 'B', 'B', 'G'],
            ['G', 'B', 'B', 'B', 'G', 'P', 'G', 'G', 'G', 'G'],
            ['G', 'G', 'G', 'B', 'G', 'P', 'P', 'P', 'P', 'E'],
            ['G', 'B', 'G', 'B', 'G', 'G', 'G', 'G', 'G', 'G'],
            ['G', 'B', 'G', 'G', 'G', 'B', 'B', 'B', 'G', 'G'],
            ['G', 'B', 'B', 'B', 'G', 'G', 'G', 'B', 'G', 'G'],
            ['G', 'G', 'G', 'G', 'G', 'B', 'G', 'G', 'G', 'G'],
            ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G']
        ];

        this.pathCells = [
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 5 },
            { row: 3, col: 5 },
            { row: 4, col: 5 },
            { row: 4, col: 6 },
            { row: 4, col: 7 },
            { row: 4, col: 8 },
            { row: 4, col: 9 }
        ];

        this.pathPoints = [];

        for (let i = 0; i < this.pathCells.length; i++) {
            let row = this.pathCells[i].row;
            let col = this.pathCells[i].col;

            this.pathPoints.push({
                x: col * this.cellSize + this.cellSize / 2,
                y: row * this.cellSize + this.cellSize / 2
            });
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let cell = new Cell(this, r, c, this.cellSize, c * this.cellSize, r * this.cellSize, this.map[r][c]);
                this.cells.push(cell);
                this.game.addSprite(cell);
            }
        }

        this.game.addSprite(new UIPanel(this));

        this.game.addSprite(new UIButton(this, 615, 60, 170, 38, 'Basic', 'basic', 50, 'Balanced'));
        this.game.addSprite(new UIButton(this, 615, 110, 170, 38, 'Sniper', 'sniper', 90, 'Range + damage'));
        this.game.addSprite(new UIButton(this, 615, 160, 170, 38, 'Rapid', 'rapid', 65, 'Fast shooting'));

        this.game.addSprite(new UIText(this, 620, 240, 'money'));
        this.game.addSprite(new UIText(this, 620, 270, 'lives'));
        this.game.addSprite(new UIText(this, 620, 300, 'wave'));
        this.game.addSprite(new UIText(this, 620, 330, 'kills'));
        this.game.addSprite(new UIText(this, 620, 360, 'selected'));
    }

    placeTower(cell) {
        if (cell.towerType !== '') {
            return;
        }

        let cost = 0;

        switch (this.selectedTowerType) {
            case 'basic':
                cost = 50;
                break;
            case 'sniper':
                cost = 90;
                break;
            case 'rapid':
                cost = 65;
                break;
        }

        if (this.money < cost) {
            return;
        }

        this.money -= cost;
        cell.towerType = this.selectedTowerType;

        let tower = new Tower(this, cell, this.selectedTowerType);
        this.towers.push(tower);
        this.game.addSprite(tower);
    }

    startNextWave() {
        this.wave++;
        this.spawningWave = true;
        this.spawnTimer = 0;
        this.enemiesToSpawn = 6 + this.wave * 2;
    }

    spawnEnemy() {
        let enemyType = 'normal';

        switch (this.wave) {
            case 1:
                enemyType = 'normal';
                break;
            case 2:
                enemyType = this.enemiesToSpawn % 3 === 0 ? 'fast' : 'normal';
                break;
            case 3:
                enemyType = this.enemiesToSpawn % 4 === 0 ? 'tank' : 'fast';
                break;
            case 4:
                enemyType = this.enemiesToSpawn % 3 === 0 ? 'tank' : 'fast';
                break;
            default:
                enemyType = this.enemiesToSpawn % 2 === 0 ? 'tank' : 'fast';
                break;
        }

        let enemy = new Enemy(this, enemyType);
        this.enemies.push(enemy);
        this.game.addSprite(enemy);
    }

    update(sprites, keys, mouse) {
        if (this.gameOver || this.win) {
            if (this.overlayAdded === false) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
                this.game.addSprite(new EndLabel(this));
                this.overlayAdded = true;
            }
            return false;
        }

        let aliveEnemies = 0;

        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].alive) {
                aliveEnemies++;
            }
        }

        if (!this.spawningWave && aliveEnemies === 0) {
            if (this.wave >= this.maxWaves) {
                this.win = true;
            } else if (this.waveDelay > 0) {
                this.waveDelay--;
            } else {
                this.startNextWave();
                this.waveDelay = 120;
            }
        }

        if (this.spawningWave) {
            if (this.spawnTimer > 0) {
                this.spawnTimer--;
            } else {
                this.spawnEnemy();
                this.enemiesToSpawn--;
                this.spawnTimer = 45;
            }

            if (this.enemiesToSpawn <= 0) {
                this.spawningWave = false;
            }
        }

        return false;
    }

    render(ctx) {
    }
}

var game = new Game();
var gameState = new GameState(game);
game.addSprite(gameState);
game.loop();