// This function defines the powerup module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the powerup
// - `y` - The initial y position of the powerup
// Height: 64px, Width: 64px
const Powerup = function(ctx, x, y, type) {

    // This is the sprite sequences of the powerup
    const sequences = { 
        extra_bomb: { x: 0, y:  0, width: 64, height: 64, count: 10, timing: 150, loop: true },
        fire: { x: 0, y:  64, width: 64, height: 64, count: 10, timing: 150, loop: true },
        speed: { x: 0, y:  448, width: 64, height: 64, count: 10, timing: 150, loop: true },
    }

    // This is the sprite object of the powerup created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the powerup sprite here.
    sprite.setSequence(sequences[type])
          .setScale(0.9)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("resources/sprites/powerups.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
