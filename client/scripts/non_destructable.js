// This function defines the destructables module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the destructables
// - `y` - The initial y position of the destructables
// Height: 18px, Width: 18px, padding width 2px
const NonDestructable = function(ctx, x, y) {

    // This is the sprite sequences of the destructables
    const sequence = {x:0, y:0, width: 18, height: 18, count: 1, timing: 100000, loop: true};

    

    // This is the sprite object of the destructables created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the destructables sprite here.
    sprite.setSequence(sequence)
          .setScale(3.5)
          .setShadowScale({ x: 0, y: 0 })
          .useSheet("resources/sprites/destructables.png");
    
    const isPointInBox = function(x, y, direction) {
        switch (direction) {
            case 1: x -= 32; break;
            case 2: y -= 32; break;
            case 3: x += 32; break;
            case 4: y += 32; break;
        }
        return sprite.getBoundingBox().isPointInBox(x,y);
    };
    
    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        isPointInBox: isPointInBox

    };
};
