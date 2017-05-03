Playing the game
==
Frogger is a simple arcade game featuring one player and multiple enemy bugs. You will attempt to cross the road without getting hit by the enemy bugs. Red bugs are the slowest, whereas green bugs are the fastest enemies. You will lose the game after getting hit by the bugs three times. When you get hit first 3 times, you will return back to the starting position automatically. Good luck!

Game controls
--
Press up, down, left, or right keyboard keys to move. Press *r* to restart the game when the game is finished.

Game installation
--
Download the zip file containing game files and open index.html with your browser.

Contributing to the game
==
Frogger is built using JavaScript and Canvas. You can contribute to the game by modifying existing elements or adding new features.

Game logic
==
- *Enemy movement*: enemies can only move on thee lanes that are located at 40, 125, 210 on the y-axis. Otherwise, the enemy will be on the grass or water tiles. Enemies move from left to right. They reappear at randomly selected `spawnPoints`.
- *Player movement*: player can move up, down, left, and right. Each step is 100 on x-axis or 85 on y-axis.
- *Collision detection*: Enemies call `didCollideWith` function in their prototype when at the end of each frame. I have chosen 55 as the buffer between player and enemy.

Existing features
--
- *Enemy*
`Enemy` is the prototype for all other enemy types. Its most important properties for modifications are:
 - `sprite` or enemy image
 - `spawnPoints` or the starting position. The further the starting position from the canvas edge, the longer it will take the enemy to enter the game screen.
 - `speed` or distance covered within each frame.
- Fast Enemy `FastEnemy`
Enemy sub-class that has higher speeds and further spawning points from the canvas
- Very Fast Enemy `VeryFastEnemy`
Enemy sub-class that has the highest speed and further spawning points from the canvas

*Example*
```
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
```

If you have created a new enemy, add it to the `allEnemies` array as a `new` object.

Adding new features
==
You can add new functionality to the game. For instance, I have left a placeholder for an animation function that should take place after the player wins.

Other ideas (wishlist)
--
- Add life counter
- Create a gem collection feature with a score counter
- Make `win` and `lost` screens prettier
- Add player selection

Known issues
--
- The player leaves "clones" behind after reaching the top. It looks like a problem within the engine.js file.
