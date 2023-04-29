
const Flame = function(ctx, origin_x, origin_y){


    const FLAME_WIDTH = 18;
    const Y_PADDING = 12;
    const X_PADDING = 2;
    
    const sequences = {
        centre: { x: (FLAME_WIDTH + X_PADDING) * 6 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
        left :{x: (FLAME_WIDTH + X_PADDING) * 10 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
        right:{x: (FLAME_WIDTH + X_PADDING) * 12 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
        up:{x: (FLAME_WIDTH + X_PADDING) * 7 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
        down:{x: (FLAME_WIDTH + X_PADDING) * 9 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
        middle_row:{x: (FLAME_WIDTH + X_PADDING) * 11 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
        middle_column:{x: (FLAME_WIDTH + X_PADDING) * 8 , y: (FLAME_WIDTH + Y_PADDING) * 2, width: FLAME_WIDTH, height: FLAME_WIDTH, count: 1, timing: 200, loop: true},
    };

    const sprite = Sprite(ctx, origin_x, origin_y);

    sprite.setSequence(sequences["centre"])
    .setScale(2)
    .useSheet("resources/sprites/items.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
}