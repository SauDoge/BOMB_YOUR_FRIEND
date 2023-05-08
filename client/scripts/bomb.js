// This function defines the bomb module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the bomb
// - `y` - The initial y position of the bomb
// Height: 64px, Width: 64px
const Bomb = function(ctx, x, y) {

    // This is the sprite sequences of the bomb/explosions
    const sequence = { x: 0, y:  0, width: 64, height: 64, count: 4, timing: 200, loop: true };
    
    let birthTime = performance.now();


    const getAge = function(now) {
        return now - birthTime;;
    }


    // This is the sprite object of the bomb created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the bomb sprite here.
    sprite.setSequence(sequence)
          .setScale(0.9)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("resources/sprites/bomb.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        getAge: getAge

    };
};
