
const Bomb = function(ctx, x, y){

    const BOMB_WIDTH = 18;
    const Y_PADDING = 12;
    const X_PADDING = 2;

    const sequences = {
        bomb:  { x: 0 , y: (BOMB_WIDTH + Y_PADDING) * 2, width: BOMB_WIDTH, height: BOMB_WIDTH, count: 3, timing: 200, loop: true},

    };

    // This is the sprite object of the gem created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the gem sprite here.
    sprite.setSequence(sequences["bomb"])
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
};