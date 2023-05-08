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

    // message for a movement of player
    const sendMessage = (move, direction) => {
        socket.emit("message", { index, room, move, direction });
    }

    // message for placing of bomb
    // position, power
    const sendBombPlacement = () => {
        socket.emit("placing bomb", {})
    }

    // message for picking up an item
    // item type, position
    const sendItemRetrieval = () => {
        socket.emit("retrieving item", {})
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
            if (i + j > 1 && !(i == 10 && i == 7) && !(i == 10 && j == 8) && !(i == 9 && j == 8))
                destructableSpace.push([i, j]);

            playable.push([i, j]);
        }

    }

    /**
    function initializeEntities(d, p, context, destructables, powerups, destructable_type) {
        //Randomize destructable and powerup locations, d = number of destructables, p = number of powerups

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
    **/
    
    const wall_coordinates = [[0, 2], [2, 2], [4, 2], [6,2], [8,2], [10, 2],
        [0, 4], [2, 4], [4, 4], [6, 4], [8, 4], [10, 4], 
        [0, 6], [2, 6], [4, 6], [6, 6], [8, 6], [10, 6]];
    const speed_coordinates = [
          [2, 1], [2, 3], [2, 5] 
        ];
    const bomb_up_coordinates = [
          [4, 1], [4, 3], [4, 5]
        ];
    const fire_coordinates = [
          [6,1 ], [6,3], [6, 5]
        ];
    
    
    function initializeEntities(context, destructables, powerups, destructable_type) {
        wall_coordinates.forEach(space => {
                destructables.push(Destructable(context, toX(space[0]), toY(space[1]), destructable_type));
                destructablesGrid.push([space[0], space[1]]);
            });
    
        speed_coordinates.forEach(space => powerups.push(Powerup(context, toX(space[0]), toY(space[1]), "speed")));
            
        bomb_up_coordinates.forEach(space => powerups.push(Powerup(context, toX(space[0]), toY(space[1]), "extra_bomb")));

        fire_coordinates.forEach(space => powerups.push(Powerup(context, toX(space[0]), toY(space[1]), "fire")));
    
    }
    

    function initializeNonDestructables(context, nonDestructables) {
        /** Initialize non-destructables **/
        nonDestructableSpace.forEach(space => nonDestructables.push(NonDestructable(context, toX(space[0]), toY(space[1]))))
    }

    const includesArray = (data, arr) => {
        return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
    }

    function createBomb(context, bomb_context, bombs, bomb_number, pos, power) {
        if (bombs.length < bomb_number) { 
            bomb = Bomb(bomb_context, toX(pos[0]), toY(pos[1]));
            bombs.push(bomb);
            setTimeout( function () {
                createExplosion(context, explosions, power, pos[0], pos[1]); 
                sounds.explosion.play();
            }, 1800);
        }
    }

    function createExplosion(context, e, power, col, row) {
        /** Create explosions **/
        e.push(Explosion(context, toX(col), toY(row), "center"));

        /* Check if player got hit by explosion */
        players.forEach((player) => player.checkExplosion(e));

        for (var i = col + 1; i < col + power; i++) {
            if (i > 10)
                break;

            if (includesArray(nonDestructableSpace, [i, row])) 
                break;
            
            broke = false

            for (d of destructables.concat(powerups)) {
                if (d.getXY().x == toX(i) && d.getXY().y == toY(row)) {
                    d.destroy();
                    if (d.getType() == "destructable") broke = true;
                }
            }
            if (broke == true) break;

            players.forEach((player) => player.checkExplosion([i, row]));

            if (i == col + power - 1) e.push(Explosion(context, toX(i), toY(row), "right"));

            else e.push(Explosion(context, toX(i), toY(row), "h_mid"));


        }
        for (var i = col - 1; i > col - power; i--) {
            if (i < 0)
                break;

            if (includesArray(nonDestructableSpace, [i, row])) 
                break;
            
            broke = false

            for (d of destructables.concat(powerups)) {
                if (d.getXY().x == toX(i) && d.getXY().y == toY(row)) {
                    d.destroy();
                    if (d.getType() == "destructable") broke = true;
                }
            }
            if (broke == true) break;

            players.forEach((player) => player.checkExplosion([i, row]));

            if (i == col - power + 1) e.push(Explosion(context, toX(i), toY(row), "left"));
        
            else e.push(Explosion(context, toX(i), toY(row), "h_mid"));
            players.forEach((player) => player.checkExplosion(e));

                        
        }

        for (var i = row + 1; i < row + power; i++) {
            if (i > 10)
                break;

            if (includesArray(nonDestructableSpace, [col, i])) 
                break;
            
            broke = false

            for (d of destructables.concat(powerups)) {
                if (d.getXY().x == toX(col) && d.getXY().y == toY(i)) {
                    d.destroy();
                    if (d.getType() == "destructable") broke = true;
                }
            }
            if (broke == true) break;

            players.forEach((player) => player.checkExplosion([col, i]));


            if (i == row + power - 1) e.push(Explosion(context, toX(col), toY(i), "down"));
    
            else e.push(Explosion(context, toX(col), toY(i), "v_mid"));
            players.forEach((player) => player.checkExplosion(e));


        }
        for (var i = row - 1; i > row - power; i--) {
            if (i < 0)
                break;

            if (includesArray(nonDestructableSpace, [col, i])) 
                break;
            
            broke = false

            for (d of destructables.concat(powerups)) {
                if (d.getXY().x == toX(col) && d.getXY().y == toY(i)) {
                    d.destroy();
                    if (d.getType() == "destructable") broke = true;
                }
            }
            if (broke == true) break;

            players.forEach((player) => player.checkExplosion([col, i]));

            if (i == row - power + 1) e.push(Explosion(context, toX(col), toY(i), "up"));

            else e.push(Explosion(context, toX(col), toY(i), "v_mid"));
            players.forEach((player) => player.checkExplosion(e));


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
    let bombs = [];
    let explosions = [];

    initializeEntities(context, destructables, powerups, "idle_brick");
    initializeNonDestructables(context, nonDestructables);
    let obstacles = nonDestructables.concat(destructables);
    let entities = powerups.concat(explosions);

    const players = [
        Player(context, toX(0), toY(0), gameArea, 0, entities),
        Player(context, toX(10), toY(8), gameArea, 1, entities)
    ];

    // Initialise sounds
    const sounds = {
        background: new Audio("resources/sounds/bomberman.ogg"),
        bomb: new Audio("resources/sounds/bomb.wav"),
        explosion: new Audio("resources/sounds/explosion.wav"),
        item: new Audio("resources/sounds/item.wav"),
        gameover: new Audio("resources/sounds/gameover.mp3"),
        cheat: new Audio("resources/sounds/cheat.mp3")
    };
    sounds.cheat.volume = 0.2;
    sounds.explosion.volume = 0.7;
    sounds.background.volume = 0.1;

    const totalGameTime = 120;   // Total game time in seconds
    let gameStartTime = 0;      // The timestamp when the game starts



    /* The main processing of the game */
    function doFrame(now, count=100, gameOver=false) {

        if (gameStartTime == 0) gameStartTime = now;

        /* Update the time remaining */
        const gameTimeSoFar = now - gameStartTime;
        const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
        $("#countdown").text(fmtMSS(timeRemaining));

        if (gameOver == true && count == 0) {
            sounds.background.pause();
            if (players[0].getAlive() && !players[1].getAlive()) {
                players[0].addScore(timeRemaining * 10);
                $("#winner-message").text("Player 1 wins!")
            }
            else if (!players[0].getAlive() && players[1].getAlive()) {
                players[1].addScore(timeRemaining * 10);
                $("#winner-message").text("Player 2 wins!")
            }
            else $("#winner-message").text("Draw!")
            updated_leaderboard = []
            $("#player1-score").text(players[0].getScore().toString());
            $("#player2-score").text(players[0].getScore().toString());
            // updated_leaderboard = leaderboard.update(players[0].getScore(), players[1].getScore());
            // 
            // $('#leaderboard').empty();
            // let i = 0
            // for (ranking of updated_leaderboard) {
                    // let rankCell = ranking.insertCell();
                    // let nameCell = ranking.insertCell();
                    // let scoreCell = ranking.insertCell();
                    // rankCell.textContext = ranking.rank;
                    // nameCell.textContext = ranking.username;
                    // scoreCell.textContext = ranking.score;

                    // if (i >= 10) break;
                    // i += 1;
            // }
            $("#container").hide();
            $("#gameover").show();
            return;
        }

        /* Update the entities, destroy destructables/explosions or use powerups if needed */
        destructables.forEach((destructable) => {
            if (destructable.getDestroyed()) {destructables = destructables.filter(d => d !== destructable)}
        })
        powerups.forEach((powerup) => {
            if (powerup.getUsed()) {sounds.item.currentTime = 0; sounds.item.play(); powerups = powerups.filter(p => p !== powerup)}
        })
        powerups.forEach((powerup) => {
            if (powerup.getDestroyed()) {powerups = powerups.filter(p => p !== powerup)}
        })
        explosions.forEach((explosion) => {
            if (explosion.getAge(now) > 600) {explosions = explosions.filter(e => e !== explosion)}
        })
        bombs_1.forEach((bomb) => {
            if (bomb.getAge(now) > 1800) {bombs_1 = bombs_1.filter(b => b !== bomb)}
        })
        bombs_2.forEach((bomb) => {
            if (bomb.getAge(now) > 1800) {bombs_2 = bombs_2.filter(b => b !== bomb)}
        }) 

        /* Update the sprites */
        players.forEach((player) => player.update(now, destructables.concat(nonDestructables), powerups));
        bombs.forEach((bomb) => bomb.update(now));
        powerups.forEach((powerup) => powerup.update(now));
        destructables.forEach(destructable => destructable.update(now));
        nonDestructables.forEach(nonDestructable => nonDestructable.update(now));
        explosions.forEach((explosion) => explosion.update(now));

        /* Clear the screen */
        context.clearRect(0, 0, cv[0].width, cv[0].height);
        bomb_context.clearRect(0, 0, cv[0].width, cv[0].height);

        /* Draw the sprites */
        players.forEach((player) => player.draw());
        bombs.forEach((bomb) => bomb.draw());
        powerups.forEach((powerup) => powerup.draw());
        destructables.forEach(destructable => destructable.draw());
        nonDestructables.forEach(nonDestructable => nonDestructable.draw());
        explosions.forEach((explosion) => explosion.draw());
        
        /* Play a few more frames before game over screen appears */
        if (timeRemaining <= 0 || !players[0].getAlive() || !players[1].getAlive()) {
            requestAnimationFrame(function(timestamp) {
                if (count== 100) sounds.gameover.play();
                doFrame(timestamp, count-1, true);
            });
        }
        else /* Process the next frame */
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
                createBomb(context, bomb_context, bombs, players[index].getBombNumber(), players[index].getPosition(), players[index].getPower());
                sendMessage(2, -1)
                break;
            case 81: {
                sounds.cheat.currentTime = 0;
                sounds.cheat.play();
                players[index].powerUp();
                break;
            }
            case 87: {
                sounds.cheat.currentTime = 0;
                sounds.cheat.play();
                players[index].speedUp();
                break;
            }
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