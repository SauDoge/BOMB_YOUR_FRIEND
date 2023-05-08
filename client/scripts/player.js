// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player


const { truncate } = require("fs");

// - `gameArea` - The bounding box of the game area
const Player = function(ctx, x, y, gameArea, type) {

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    // Width: 18 px, Height: 27px, space: 2px width or 13px height
    const sequences = {
        /* Idling sprite sequences for facing different directions */
        idleUp:    { x: 0, y: 0 + 40 * type, width: 18, height: 27, count: 1, timing: 2000, loop: false },
        idleLeft:  { x: 60, y: 0 + 40 * type, width: 18, height: 27, count: 1, timing: 2000, loop: false },
        idleDown: { x: 120, y: 0 + 40 * type, width: 18, height: 27, count: 1, timing: 2000, loop: false },
        idleRight:  { x: 340, y: 0 + 40 * type, width: 18, height: 27, count: 1, timing: 2000, loop: false },

        /* Moving sprite sequences for facing different directions */
        moveUp:    { x: 20, y: 0 + 40 * type, width: 20, height: 27, count: 2, timing: 100, loop: true },
        moveLeft:  { x: 80, y: 0 + 40 * type, width: 20, height: 27, count: 2, timing: 100, loop: true },
        moveDown:  { x: 140, y: 0 + 40 * type, width: 20, height: 27, count: 2, timing: 100, loop: true },
        moveRight: { x: 300, y: 0 + 40 * type, width: 20, height: 27, count: 2, timing: 100, loop: true },


        /* For different conditions */
        victory: {x: 220, y: 0 + 40 * type, width: 25, height: 35, count: 2, timing: 50, loop: true},
        defeat: {x: 260, y: 0 + 40 * type, width: 25, height: 35, count: 2, timing: 50, loop: true},
        dead: {x: 180, y: 0 + 40 * type, width: 20, height: 28, count: 2, timing: 150, loop: true},
        
    };

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the player sprite here.
    sprite.setSequence(sequences.idleDown)
          .setScale(2.5)
          .setShadowScale({ x: 0.75, y: 0.20 })
          .useSheet("resources/sprites/characters.png");

    // This is the moving direction, which can be a number from 0 to 4:
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    let direction = 0;
    

    // This is the moving speed (pixels per second) of the player
    let speed = 150;

    // This is the bomb power (radius) of the player
    let power = 2

    // This is the number of bombds the player can place
    let bomb_number = 1

    // Max stats
    const MaxSpeed = 300;
    const MaxPower = 11;
    const MaxBombNumber = 5;

    // This is the score of the player
    let score = 0

    // This is the player's status
    let alive = true;

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // This function sets the player's moving direction.
    // - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down)
    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir != direction) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveLeft); break;
                case 2: sprite.setSequence(sequences.moveUp); break;
                case 3: sprite.setSequence(sequences.moveRight); break;
                case 4: sprite.setSequence(sequences.moveDown); break;
            }
            direction = dir;
        }
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
    const stop = function(dir) {
        if (direction == dir) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.idleLeft); break;
                case 2: sprite.setSequence(sequences.idleUp); break;
                case 3: sprite.setSequence(sequences.idleRight); break;
                case 4: sprite.setSequence(sequences.idleDown); break;
            }
            direction = 0;
        }
    };

    // This function speeds up the player.
    const speedUp = function() {
        speed = MaxSpeed;
    };

    // This function increases the power of the bombs of the player.
    const powerUp = function() {
        power = MaxPower;
    }

    // Return the nearest grid space of the player
    const getPosition = function() {
        let { x, y } = sprite.getXY();
        return [Math.round((x - 100)/63), Math.round((y - 80)/63)];
    }

    const getAlive = function() {
        return alive;
    }

    const getBombNumber = function() {
        return bomb_number;
    }

    const getPower = function() {
        return power;
    }

    const getScore = function() {
        return score;
    }

    const addScore = function(num) {
        if (num > 0) score += num;
    }

    const checkExplosion = function(arr) {
        if (arraysEqual(arr, getPosition())) {
            sprite.setSequence(sequences.dead);
            alive = false; 
        }
    }


    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function(time, obstacles, powerups) {
        /* Update the player if the player is moving */
        if (direction != 0 && alive) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }
            for (powerup of powerups) {
                if (powerup.intersect(sprite.getBoundingBox()) && !powerup.getUsed()) {
                    switch (powerup.getType()) {
                        case "fire": {if (power < MaxPower) power += 1; score += 10; powerup.use(); break;}
                        case "speed": {if (speed < MaxSpeed) speed += 50; score += 10; powerup.use(); break;}
                        case "extra_bomb": {if (bomb_number < MaxBombNumber) bomb_number += 1; score += 10; powerup.use(); break;}
                    }
                }
            }

            /* Set the new position if it is within the game area */
            /* Handle collision with obstacles */
            if (gameArea.isPointInBox(x, y)) {
                for (obstacle of obstacles)
                    if (obstacle.isPointInBox(x,y, direction))
                        return;
                sprite.setXY(x, y);
            }
            
        }

        /* Update the sprite object */
        sprite.update(time);
    };

    // The methods are returned as an object here.
    return {
        move: move,
        stop: stop,
        speedUp: speedUp,
        powerUp: powerUp,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        getPosition: getPosition,
        getAlive: getAlive,
        getBombNumber: getBombNumber,
        getPower: getPower,
        getScore: getScore,
        addScore: addScore,
        checkExplosion: checkExplosion
    };
};