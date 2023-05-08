// This function defines the destructables module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the destructables
// - `y` - The initial y position of the destructables
// Height: 18px, Width: 18px, padding width 2px
const Destructable = function(ctx, x, y, type) {

    // This is the sprite sequences of the destructables
    const sequences = { 
        // Invisible blocks for pre built obstacles on every stage
        invisible: {x:0, y:0, width: 18, height: 18, count: 1, timing: 100000, loop: true},

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
    
    // Variable holding status of block
    let destroyed = false;

    const destroy = function() {
        /* Destroy the block */
        switch (type) {
            case "idle_brick": 
                sprite.setSequence(sequences["destroyed_brick"]);
                break;
            case "idle_snowman": 
                sprite.setSequence(sequences["destroyed_snowman"]);
                break;
            case "idle_stone": 
                sprite.setSequence(sequences["destroyed_stone"]);
                break;
            case "idle_gem": 
                sprite.setSequence(sequences["destroyed_gem"]);
                break;
        }

        setTimeout(function () {destroyed = true;}, 600);
    };

    const getType = function() {
        return "destructable";
    }

    const getDestroyed = function() {
        return destroyed;
    }

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
        destroy: destroy,
        draw: sprite.draw,
        update: sprite.update,
        isPointInBox: isPointInBox,
        getDestroyed: getDestroyed,
        getType: getType

    };
};
