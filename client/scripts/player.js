// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Player = function(ctx, x, y, gameArea, type, entities) {

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
        dead: {x: 180, y: 0 + 40 * type, width: 25, height: 35, count: 2, timing: 50, loop: false},
        
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

    // This is the player's status
    let alive = true;

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
        speed = 250;
    };

    // This function slows down the player.
    const slowDown = function() {
        speed = 150;
    };

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

    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function(time, obstacles) {
        /* Update the player if the player is moving */
        if (direction != 0) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }
            for (entity of entities) {
                if (entity.intersect(sprite.getBoundingBox()) && !entity.getUsed()) {
                    switch (entity.getType()) {
                        case "fire": power += 1; entity.use(); break;
                        case "speed": speed += 50; entity.use(); break;
                        case "extra_bomb": bomb_number += 1; entity.use(); break;
                        case "explosion": sprite.setSequence(sequences.dead);
                        alive = dead; break;

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
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        getPosition: getPosition,
        getAlive: getAlive,
        getBombNumber: getBombNumber,
        getPower: getPower
    };
};