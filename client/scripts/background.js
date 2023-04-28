// The function describes the background module
// ctx: canvas context for drawing 
// x: Initial x position of the map
// y: Initial y position of the map

const Background = function(ctx, x, y, index){
    
    const sequences = {
        // width = 234; height: 198; padding_x: 15; padding_y: 20
        0: {x: 0, y: 0, width: 234 , height: 198, loop:false},
        1: {x: 250, y: 0, width: 234 , height: 198, loop:false},
        2: {x: 0, y: 220, width: 234 , height: 198, loop:false},
        3: {x: 250, y: 220, width: 234 , height: 198, loop:false},
        4: {x: 500, y: 220, width: 234 , height: 198, loop:false},
        5: {x: 0, y: 440, width: 234 , height: 198, loop:false},
        6: {x: 250, y: 440, width: 234 , height: 198, loop:false},
        7: {x: 500, y: 440, width: 234 , height: 198, loop:false},
    }

    const sprite = Sprite(ctx, x, y);
    
    // Configure the background here
    sprite.setSequence(sequences[index])
    .setScale(3)
    .setShadowScale({ x: 0, y: 0 })
    .useSheet("resources/sprites/Backgrounds.png");

    // Select the appropriate background
    const setBackground = function(index){
        sprite.setSequence(sequences[index]);
    };

    return{
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        setBackground: setBackground,
    }



}