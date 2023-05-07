import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');
});

$(document).ready(function () {
    Form.init();

    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");

    // define the gameArea 
    const gameArea = BoundingBox(context, 165, 60, 200, 235);
    const corners = gameArea.getPoints();


    // create a Background instance
    // draw the instance
    // x, y are the center of the canvas
    const type_of_background = 0;
    const background = Background(context, 352, 300, type_of_background);
    background.draw();
    context.beginPath();
    context.moveTo(165, 60);
    context.lineTo(300, 150);
    context.stroke();
    // Set Boundaries 
    // sqaure grid width = 18px; 
    const grid_width = 18;
    const num_rows = 11
    const num_cols = 13
    const boundaries = [];
    for (var j = 0; j < num_rows; j++) {
        if (j == 0 || j == num_rows - 1) {
            for (var i = 0; i < num_cols; i++) {
                {
                    boundaries.push(BoundingBox(context, grid_width * i, grid_width * j, grid_width * (i + 1), grid_width * (j + 1)));
                }
            }
        }
        else if (j % 2 == 1) {
            boundaries.push(BoundingBox(context, grid_width * 0, grid_width * j, grid_width * 1, grid_width * (j + 1)));
            boundaries.push(BoundingBox(context, grid_width * (num_cols - 1), grid_width * j, grid_width * num_cols, grid_width * (j + 1)));
        }
        else if (j % 2 == 0) {
            // get every even i
            for (var i = 0; i < num_cols; i++) {
                {
                    if (i % 2 == 0) {
                        boundaries.push(BoundingBox(context, grid_width * i, grid_width * j, grid_width * (i + 1), grid_width * (j + 1)));
                    }
                }
            }
        }
    }
});