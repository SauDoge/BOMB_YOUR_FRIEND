// This function defines the destructables module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the destructables
// - `y` - The initial y position of the destructables
// Height: 18px, Width: 18px, padding width 2px
const Destructable = function(ctx, x, y, type) {

    // This is the sprite sequences of the destructables
    const sequences = { 

        // Non-destroyed blocks
        idle_brick: { x: 0, y: 30, width: 18, height: 18, count: 1, timing: 200, loop: true },
        idle_snowman: { x: 60, y: 30, width: 18, height: 18, count: 1, timing: 200, loop: true },
        idle_stone: { x: 180, y: 30, width: 18, height: 18, count: 1, timing: 200, loop: true },
        idle_gem: { x: 480, y: 30, width: 18, height: 18, count: 1, timing: 200, loop: true },

        // When destroyed 
        destroyed_brick: { x: 0, y: 30, width: 20, height: 18, count: 3, timing: 200, loop: false },
        destroyed_snowman: { x: 60, y: 30, width: 20, height: 18, count: 3, timing: 200, loop: false },
        destroyed_stone: { x: 180, y: 30, width: 20, height: 18, count: 3, timing: 200, loop: false },
        destroyed_gem: { x: 480, y: 30, width: 20, height: 18, count: 3, timing: 200, loop: false }

    }

    // This is the sprite object of the destructables created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the destructables sprite here.
    sprite.setSequence(sequences[type])
          .setScale(3.5)
          .setShadowScale({ x: 0, y: 0 })
          .useSheet("resources/sprites/destructables.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
