// This function defines the bomb module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the bomb
// - `y` - The initial y position of the bomb
// Height: 64px, Width: 64px
const Bomb = function(ctx, x, y, type) {

    // This is the sprite sequences of the bomb/explosions
    const sequences = { 
        bomb: { x: 0, y:  0, width: 64, height: 64, count: 4, timing: 200, loop: true },

        // Sprite sequences for explosions e.g. center is explosion epicenter, left is left tail of explosion etc.
        center: { x: 0, y:  64, width: 64, height: 64, count: 4, timing: 200, loop: false },
        h_mid: { x: 0, y:  128, width: 64, height: 64, count: 4, timing: 200, loop: false },
        right: { x: 0, y:  192, width: 64, height: 64, count: 4, timing: 200, loop: false },
        left: { x: 0, y:  256, width: 64, height: 64, count: 4, timing: 200, loop: false },
        v_mid: { x: 0, y:  320, width: 64, height: 64, count: 4, timing: 200, loop: false },
        up: { x: 0, y:  384, width: 64, height: 64, count: 4, timing: 200, loop: false },
        down: { x: 0, y:  448, width: 64, height: 64, count: 4, timing: 200, loop: false }

    }

    // This is the sprite object of the bomb created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the bomb sprite here.
    sprite.setSequence(sequences[type])
          .setScale(0.9)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("resources/sprites/bomb.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
