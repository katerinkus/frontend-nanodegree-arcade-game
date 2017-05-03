// Game object maintains current state, and knowns how to show "win" and "lost"
// screens. It also knows how to restart a game.
// Win and Lost screens are divs in the HTML.
var Game = function () {
    // Game state could be "playing", "won" or "lost".
    this.state = "playing";

    this.divs = {
        win: document.getElementById("win"),
        lost: document.getElementById("lost")
    };
    // Allows speed control of all enemies.
    this.speedMultiplier = 2;

    // How many times can player collide before loosing?
    this.lives = 3;
}

// Checks if player has enough lives. If player is alive, re-spawns it.
// If player is dead, game is lost.
Game.prototype.finishOrRespawnPlayer = function () {
    if (player.collisionCount >= this.lives) {
        this.lost();
    } else {
        player.spawn();
    }
};

Game.prototype.won = function () {
    this.state = "won";
    this.divs.win.classList.remove("hidden");
    this.divs.lost.classList.add("hidden");
};

Game.prototype.lost = function () {
    this.state = "lost";
    this.divs.win.classList.add("hidden");
    this.divs.lost.classList.remove("hidden");
};

Game.prototype.restart = function () {
    this.state = "playing";
    this.divs.win.classList.add("hidden");
    this.divs.lost.classList.add("hidden");
    player.collisionCount = 0;
};

Game.prototype.on = function () {
    return this.state === "playing";
}

// Enemies our player must avoid.
var Enemy = function() {
    this.x = 0;
    this.y = 40;
    this.xStep = this.speed() * game.speedMultiplier;
};

// Override these functions in different enemy sub-classes to customize them:

// Basic enemy sprite.
Enemy.prototype.sprite = function () {
    return "images/enemy-bug.png";
};

// Where can the enemy appear? Negative values are to the left of the canvas.
// The further these are from the canvas, the longer it will take the enemy to
// re-appear on the screen.
// Must return an array.
Enemy.prototype.spawnPoints = function () {
    return [-100, -200];
};

// How fast does this enemy move?
Enemy.prototype.speed = function () {
    return 170;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // If game is not on, don't move this enemy.
    if (!game.on()) {
        return;
    }

    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.xStep * dt

    // Re-spawn enemy if they're too far right outside of the canvas.
    if (this.x > 505) {
        this.spawn();
    }

    // Check if we collided with the player.
    if (this.didCollideWith(player)) {
        // Tell player that we collided with it!
        player.collidedWith(this);
    }
};

// Check if this enemy collided with 'other'.
// 'other' could be any object which has 'x' and 'y'.
Enemy.prototype.didCollideWith = function (other) {
    // All participants are moving on horizontal tracks. If they're on the same
    // track, their y values will be the same.
    // Collision is "on the same horizontal track, and within a certain threshold".
    var collisionThresholdX = 55;
    return this.y === other.y &&
        Math.abs(this.x - other.x) < collisionThresholdX;
}

// Spawns the enemy.
Enemy.prototype.spawn = function () {
    // This is an array of spawn points. E.g. [-1, -2, -3]
    var possibleSpawnPoints = this.spawnPoints();

    // Pick number of our spawn point randomly.
    var whichSpawnPoint = randomNumberInRange(0, possibleSpawnPoints.length);

    // Set player's x position to their spawn point.
    this.x = possibleSpawnPoints[whichSpawnPoint];

    var numberOfLanes = 3;
    var firstLaneY = 40;
    var laneHeight = 85;

    // Set player's y position to their randomely picked lane.
    this.y = randomNumberInRange(0, numberOfLanes) * laneHeight + firstLaneY;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite()), this.x, this.y);
};

// A faster type of an enemy. Sub-classes regular enemy class.
class FastEnemy extends Enemy {
    sprite() {
        return "images/fast-enemy-bug.png";
    }

    speed() {
        return 210;
    }

    // Note that these are larger values, which means that faster enemy will spawn
    // further away from the game canvas. Which means it will appear less often
    // in the game.
    spawnPoints() {
        return [-300, -400, -500, -600, -700];
    }
}

// A much faster type of an enemy. Sub-classes regular enemy class.
class VeryFastEnemy extends Enemy {
    sprite() {
        return "images/fast-enemy-bug.png";
    }

    speed() {
        return 310;
    }

    // Note that these are larger values, which means that faster enemy will spawn
    // further away from the game canvas. Which means it will appear less often
    // in the game.
    spawnPoints() {
        return [-300, -100, -200, -400, -500];
    }
}

var Player = function() {
    this.sprite = 'images/char-boy.png';

    // How many times did we collide?
    this.collisionCount = 0;

    // Spawn the player when it's created.
    this.spawn();
};

Player.prototype.spawn = function() {
    this.x = 0;
    this.y = 380;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // TODO Win animation for the player.
    if (game.state === "won") {
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles player keyboard input.
Player.prototype.handleInput = function(move) {
    // If game is not on, ignore player keyboard input.
    if (!game.on()) {
        return;
    }

    // Move the player.
    var xStep = 100
    var yStep = 85

    if (move === 'right') {
        this.x += xStep;
    } else if (move === 'up') {
        this.y -= yStep;
    } else if (move === 'left') {
        this.x -= xStep;
    } else if (move === 'down') {
        this.y += yStep;
    }

    // Check if we're within our boundaries.
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.y > 380) {
        this.y = 380;
    }
    if (this.y < -45) {
        this.y = -45;
    }

    // Did we win?
    if (this.y === -45) {
        game.won();
    }
}

// Enemies will call this function when they've detected that they collided with.
Player.prototype.collidedWith = function (enemy) {
    this.collisionCount += 1;
    game.finishOrRespawnPlayer(this);
};

// Helper function for generating a random number.
function randomNumberInRange(from, to) {
    return Math.floor(Math.random() * to) + from;
}

var game = new Game();
var allEnemies = [
    new Enemy(), new FastEnemy(), new FastEnemy(),
    new Enemy(), new VeryFastEnemy(), new VeryFastEnemy(),
    new Enemy(), new FastEnemy(), new VeryFastEnemy()
];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // Player pressed "r", restart the game.
    if (e.keyCode === 82 && game.state !== "playing") {
        player.spawn();
        game.restart();
    }

    player.handleInput(allowedKeys[e.keyCode]);
});
