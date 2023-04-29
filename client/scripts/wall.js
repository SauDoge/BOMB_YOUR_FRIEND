
const Wall = function(ctx, x, y, type){

    const WALL_WIDTH = 18;
    const Y_PADDING = 12;
    const X_PADDING = 2;

    const sequences = {
        solid:  { x: WALL_WIDTH + X_PADDING , y: WALL_WIDTH + Y_PADDING, width: WALL_WIDTH, height: WALL_WIDTH, count: 1, timing: 200, loop: false},

        destructing: { x: WALL_WIDTH + X_PADDING , y: WALL_WIDTH + Y_PADDING, width: WALL_WIDTH, height: WALL_WIDTH, count: 2, timing: 50, loop: false},
    
    };

    // This is the sprite object of the gem created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the gem sprite here.
    sprite.setSequence(sequences["solid"])
          .setScale(3)
          .useSheet("resources/sprites/items.png");
    
    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
