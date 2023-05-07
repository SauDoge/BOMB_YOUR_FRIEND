import { io } from "socket.io-client";
import { getUsername } from "../utils/helper";

const socket = io.connect('http://localhost:3000');

socket.on("connect", () => {
    console.log(`${getUsername()} logged in room ${localStorage.getItem("room")}`);
    socket.emit("join", localStorage.getItem("room"));
})

$(document).ready(function () {
    let index = 0;
    let assigned = false;
    const room = localStorage.getItem("room");

    const sendMessage = (move, direction) => {
        socket.emit("message", { index, room, move, direction });
    }


    // HELPER FUNCTIONS

    // Seconds to minutes formatting
    function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }

    // Transform grid number into x-coordinates for drawing on canvas (0 to 10)
    function toX(col) {
        // 108, 94 is coordinates of upper left playable corner, add 63 to either to get to adjacent square
        if (col > 10) col = 10
        return 108 + col * 63
    }

    // Transform grid number into y-coordinates for drawing on canvas (0 to 8)
    function toY(row) {
        if (row > 8) row = 8
        return 94 + row * 63
    }

    // Get playable and non playable grid spaces
    const playable = [];
    const destructableSpace = [];
    const nonDestructableSpace = [];
    let destructablesGrid = [];
    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 9; j++) {
            if (i % 2 && j % 2) {
                nonDestructableSpace.push([i, j])
                continue;
            }

            // Can't have destructable in initial player square and adjacent squares
            if (i + j > 1 && i + j < 17)
                destructableSpace.push([i, j]);

            playable.push([i, j]);
        }

    }

    function initializeEntities(d, p, context, destructables, powerups, destructable_type) {
        /** Randomize destructable and powerup locations, d = number of destructables, p = number of powerups **/
        // Shuffle array
        const shuffled = destructableSpace.sort(() => 0.5 - Math.random());

        // Get sub-array of first n elements after shuffled
        let selected = shuffled.slice(0, d);
        let non_selected = shuffled.slice(d + 1, d + 1 + p);
        selected.forEach(space => {
            destructables.push(Destructable(context, toX(space[0]), toY(space[1]), destructable_type));
            destructablesGrid.push([space[0], space[1]]);
        });
        non_selected.forEach(space => powerups.push(Powerup(context, toX(space[0]), toY(space[1]), "random")))
    }

    function initializeNonDestructables(context, nonDestructables) {
        /** Initialize non-destructables **/
        nonDestructableSpace.forEach(space => nonDestructables.push(NonDestructable(context, toX(space[0]), toY(space[1]))))
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const includesArray = (data, arr) => {
        return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
    }

    function createBomb(context, bomb_context, bombs, bomb_number, explosions_arr, pos, power, obstacles) {
        if (bombs.length < bomb_number) {
            bombs.push(Bomb(bomb_context, toX(pos[0]), toY(pos[1])));
            setTimeout(function () { const pos_arr = createExplosion(context, explosions, power, obstacles, pos[0], pos[1]); }, 2000);
            //explosions = explosions.filter( (e) => !explosion.includes(e));
        }
    }

    function createExplosion(context, e, power, obstacles, col, row) {
        /** Create explosions **/
        // Create array of explosion positions to return to delete explosions
        let positions = []
        positions.push([col, row])
        e.push(Explosion(context, toX(col), toY(row), "center"));

        for (var i = col + 1; i < col + power; i++) {
            if (i > 10)
                break;

            if (includesArray(nonDestructableSpace, [i, row]))
                break;

            let broke = false

            for (const d of destructables) {
                if (d.getXY().x == toX(i) && d.getXY().y == toY(row)) {
                    d.destroy_animation();
                    broke = true;
                }
            }
            if (broke == true) break;

            if (i == col + power - 1) {
                e.push(Explosion(context, toX(i), toY(row), "right"));
                positions.push([i, row])
            }
            else {
                e.push(Explosion(context, toX(i), toY(row), "h_mid"));
                positions.push([i, row])
            }
        }
        for (var i = col - 1; i > col - power; i--) {
            if (i < 0)
                break;

            if (includesArray(nonDestructableSpace, [i, row]))
                break;

            let broke = false

            for (const d of destructables) {
                if (d.getXY().x == toX(i) && d.getXY().y == toY(row)) {
                    d.destroy_animation();
                    broke = true;
                }
            }
            if (broke == true) break;

            if (i == col - power + 1) {
                e.push(Explosion(context, toX(i), toY(row), "left"));
                positions.push([i, row])
            }
            else {
                e.push(Explosion(context, toX(i), toY(row), "h_mid"));
                positions.push([i, row])
            }
        }

        for (var i = row + 1; i < row + power; i++) {
            if (i > 10)
                break;

            if (includesArray(nonDestructableSpace, [col, i]))
                break;

            let broke = false

            for (const d of destructables) {
                if (d.getXY().x == toX(col) && d.getXY().y == toY(i)) {
                    d.destroy_animation();
                    broke = true;
                }
            }
            if (broke == true) break;

            if (i == row + power - 1) {
                e.push(Explosion(context, toX(col), toY(i), "down"));
                positions.push([col, i])
            }
            else {
                e.push(Explosion(context, toX(col), toY(i), "v_mid"));
                positions.push([col, i])
            }
        }
        for (var i = row - 1; i > row - power; i--) {
            if (i < 0)
                break;

            if (includesArray(nonDestructableSpace, [col, i]))
                break;

            let broke = false

            for (const d of destructables) {
                if (d.getXY().x == toX(col) && d.getXY().y == toY(i)) {
                    d.destroy_animation();
                    broke = true;
                }
            }
            if (broke == true) break;

            if (i == row - power + 1) {
                e.push(Explosion(context, toX(col), toY(i), "up"));
                positions.push([col, i])
            }
            else {
                e.push(Explosion(context, toX(col), toY(i), "v_mid"));
                positions.push([col, i])
            }
        }
    }


    // Create three canvases, one for background, one for entities, one for bombs
    const bg_cv = $("#background");
    const bg_context = bg_cv[0].getContext("2d");
    const bomb_cv = $("#bomb_canvas");
    const bomb_context = bomb_cv[0].getContext("2d");
    const cv = $("#entities_canvas");
    const context = cv[0].getContext("2d");

    // define the gameArea 
    const gameArea = BoundingBox(context, toY(0), toX(0), toY(8), toX(10));
    const corners = gameArea.getPoints();

    // create a Background instance
    // draw the instance
    // x, y are the center of the canvas
    const type_of_background = 0;
    const background = Background(bg_context, 425, 350, type_of_background);
    background.draw();

    /* Create the sprites in the game */
    let destructables = []
    let powerups = []
    let nonDestructables = []
    let bombs_1 = [];
    let bombs_2 = [];
    let explosions = [];

    initializeEntities(10, 30, context, destructables, powerups, "idle_brick")
    initializeNonDestructables(context, nonDestructables);
    let obstacles = nonDestructables.concat(destructables)
    let entities = powerups.concat(explosions);

    const players = [
        Player(context, toX(0), toY(0), gameArea, 2, entities),
        Player(context, toX(10), toY(8), gameArea, 1, entities)
    ];

    // Initialise sounds
    const sounds = {
        background: new Audio("resources/sounds/bomberman.ogg"),
        bomb: new Audio("resources/sounds/bomb.wav"),
        explosion: new Audio("resources/sounds/explosion.wav"),
        item: new Audio("resources/sounds/item.wav")

    };

    sounds.background.volume = 0.3

    // Set Boundaries 
    // Square grid width = 18px; 
    // grid_width = 18;
    // num_rows = 11
    // num_cols = 13
    // const boundaries = [];
    // for (var j = 0; j < num_rows; j++) {
    //     if (j == 0 || j == num_rows - 1) {
    //         for (var i = 0; i < num_cols; i++) {
    //             {
    //                 boundaries.push(BoundingBox(context, grid_width * i, grid_width * j, grid_width * (i + 1), grid_width * (j + 1)));
    //             }
    //         }
    //     }
    //     else if (j % 2 == 1) {
    //         boundaries.push(BoundingBox(context, grid_width * 0, grid_width * j, grid_width * 1, grid_width * (j + 1)));
    //         boundaries.push(BoundingBox(context, grid_width * (num_cols - 1), grid_width * j, grid_width * num_cols, grid_width * (j + 1)));
    //     }
    //     else if (j % 2 == 0) {
    //         // get every even i
    //         for (var i = 0; i < num_cols; i++) {
    //             {
    //                 if (i % 2 == 0) {
    //                     boundaries.push(BoundingBox(context, grid_width * i, grid_width * j, grid_width * (i + 1), grid_width * (j + 1)));
    //                 }
    //             }
    //         }
    //     }
    // }

    const totalGameTime = 120;   // Total game time in seconds
    let gameStartTime = 0;      // The timestamp when the game starts



    /* The main processing of the game */
    function doFrame(now) {
        if (gameStartTime == 0) gameStartTime = now;

        /* Update the time remaining */
        const gameTimeSoFar = now - gameStartTime;
        const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
        $("#countdown").text(fmtMSS(timeRemaining));

        /* Handle the game over situation here */
        if (timeRemaining <= 0 || !players[0].getAlive() || !players[1].getAlive()) {
            sounds.background.pause();
            $("#container").hide();
            $("#gameover").show();
            return;
        }

        /* Update the entities */
        destructables.forEach((destructable) => {
            if (destructable.getDestroyed()) { destructables = destructables.filter(d => d !== destructable) }
        })
        powerups.forEach((powerup) => {
            if (powerup.getUsed()) { powerups = powerups.filter(p => p !== powerup) }
        })
        obstacles = destructables.concat(nonDestructables)
        entities = powerups.concat(explosions)


        /* Update the sprites */
        players.forEach((player) => player.update(now, obstacles));
        bombs_1.forEach((bomb) => bomb.update(now));
        bombs_2.forEach((bomb) => bomb.update(now));
        powerups.forEach((powerup) => powerup.update(now));
        destructables.forEach(destructable => destructable.update(now));
        nonDestructables.forEach(nonDestructable => nonDestructable.update(now));
        explosions.forEach((explosion) => explosion.update(now));

        /* Clear the screen */
        context.clearRect(0, 0, cv[0].width, cv[0].height);
        bomb_context.clearRect(0, 0, cv[0].width, cv[0].height);

        /* Draw the sprites */
        players.forEach((player) => player.draw());
        bombs_1.forEach((bomb) => bomb.draw());
        bombs_2.forEach((bomb) => bomb.draw());
        powerups.forEach((powerup) => powerup.draw());
        destructables.forEach(destructable => destructable.draw());
        nonDestructables.forEach(nonDestructable => nonDestructable.draw());
        explosions.forEach((explosion) => explosion.draw());

        /* Process the next frame */
        requestAnimationFrame(doFrame);
    }



    /* Handle the keydown of arrow keys and spacebar */
    $(document).on("keydown", function (event) {

        /* Handle the key down */
        switch (event.keyCode) {
            case 37:
                players[index].move(1);
                sendMessage(0, 1);
                break;
            case 38:
                players[index].move(2);
                sendMessage(0, 2);
                break;
            case 39:
                players[index].move(3);
                sendMessage(0, 3);
                break;
            case 40:
                players[index].move(4);
                sendMessage(0, 4);
                break;
            case 32:
                createBomb(context, bomb_context, bombs_1, players[index].getBombNumber(), explosions, players[index].getPosition(), players[index].getPower(), obstacles);
                sendMessage(2, -1)
                break;
        }

    });

    /* Handle the keyup of arrow keys and spacebar */
    $(document).on("keyup", function (event) {

        /* Handle the key up */
        switch (event.keyCode) {
            case 37:
                players[index].stop(1);
                sendMessage(1, 1);
                break;
            case 38:
                players[index].stop(2);
                sendMessage(1, 2);
                break;
            case 39:
                players[index].stop(3);
                sendMessage(1, 3);
                break;
            case 40:
                players[index].stop(4);
                sendMessage(1, 4);
                break;
        }

    });

    socket.on("receive", (data) => {
        switch (data.move) {
            case 0:
                players[data.index].move(data.direction);
                break;
            case 1:
                players[data.index].stop(data.direction);
                break;
            default:
                createBomb(context, bomb_context, bombs_1, players[data.index].getBombNumber(), explosions, players[data.index].getPosition(), players[data.index].getPower(), obstacles);
        }
    })

    socket.on("clientConnected", (size) => {
        if (size === 2) {
            if (!assigned)
                index = 1;
            sounds.background.play()
            requestAnimationFrame(doFrame);
        } else {
            assigned = true;
        }
    })
});