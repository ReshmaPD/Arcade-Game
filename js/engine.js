/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        myReq,//reqID to cancelAnimationFrame
        lastTime;

    const modal = document.getElementById("popup");//to show a popup before playing and after game is over as well as showing game rules

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

/**-------------------------------------------------------------------------------------------------------------------------------- */
/**---------------------------------------------------------------MY CODE 1-------------------------------------------------------- */
/**TODO:Reset the game.
 * @description Called by the EventListener
 * @returns reset the score and hitbug counter as well as reflect that on the screen using template literals
 */
function resetCounter() {
    scoreStatus = 0;
    hitBug = 0;
    score.innerHTML = `${scoreStatus}`;
    caught.innerHTML = `${hitBug}`;
}

/**---------------------------------------------------EVENT LISTENER FOR MODAL & BUTTONS-------------------------------------------*/
/**TODO:Show modal after wining or losing the game and to show Instructions on how to play the game and to reset the game.
 * @description Set up the event listener for the replay button and rules button and modal buttons
 * @param querySelector for respective button classes and modal button classes
 * @returns requests animation frame , resets the score and hitbug counter as well as player position
 */
document.querySelector('.repeat').addEventListener('click', function() {
    win.requestAnimationFrame(main);
    player.reset();
    resetCounter();
}, false);

document.querySelector('.modal_replay').addEventListener('click', function() {
    win.requestAnimationFrame(main);
    modal.classList.toggle('hide', true);
    player.reset();
    resetCounter();
}, false);

//on clicking the cancel icon on the popup, hide the modal-lets the player see the winning and losing game before replaying
document.querySelector('.modal_cancel').addEventListener('click', function() {
    modal.classList.toggle('hide', true);
}, false);
//on clicking the rules button on the screen, shows the game instructions and more info via modal popup.
document.querySelector('.rules').addEventListener('click', function() {
    ruleModal();
}, false);
/**-------------------------------------------------------------------------------------------------------------------------------- */
/**---------------------------------------------------------------MY CODE END 1---------------------------------------------------- */
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
       myReq= win.requestAnimationFrame(main);

       checkCollisions();
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {

        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
           enemy.update(dt);
        });
        player.update(dt);
    }
/**-----------------------------------------------------------------MY CODE 2--------------------------------------------------------- */
/**----------------------------------------------------------------------------------------------------------------------------------- */
//Reference- https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
//Axis-Aligned Bounding Box
//canvas width 101 & height is 83 ,-10 is the water block adjusted padding to get the center position
//the numbers are tested and adjusted to check colliion occur not to early or late.
//Reference-https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
//Reference-https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame
//Reference-https://alligator.io/js/classlist/

//TODO: 2D collision Detection
/**
 * @description fucnction to detect collison between vehicle and player
 * @param {numbers} --player and enemy x & y position
 * @returns decrease score counter if collison occurs stored in hitBug counter, and reset player position
 * if hitbug is 10, stop the animation to capture the collison and show the gameOver modal
 * if scoreStatus counter is 5 while hitbug is less than 10 - stop the animation to capture player on the top surface and show the winModal
 */
function checkCollisions() {
    allEnemies.forEach(function (enemy) {
        if (player.x < enemy.x + 80 && enemy.x < player.x + 80 &&
            player.y - 10 < enemy.y + 80 && enemy.y < player.y - 10 + 80) {
            player.reset(); //call reset function which resets the player position to initial value
            hitBug++;
            caught.innerHTML = `${hitBug}`; //reflect caught counter on screen
            //only reduce if the score is positive
            if (scoreStatus > 0) {
                scoreStatus--;
                score.innerHTML = `${scoreStatus}`; //reflect score counter on screen
            }
        }
    });
    //if the player wins Cancel an animation frame request previously scheduled through a call to window.requestAnimationFrame().
    if (scoreStatus === 5 && hitBug < 10) {
        //if score is 5 , update the counter and call winModal() function and show the modal popup
        score.innerHTML = `${scoreStatus}`;
        setTimeout(() => {
            modal.classList.toggle('hide', false); //to display the modal toggle the hide class change its display property
            winModal(); //call the winModal function in app.js
        }, 400);
        cancelAnimationFrame(myReq); // where myReq = win.requestAnimationFrame(main)
    }
    //if player is caught 10 times, show game over modal and cancel Animation frame
    else if (hitBug === 10 && scoreStatus < 5) {
        setTimeout(() => {
            modal.classList.toggle('hide', false);
            gameOver(); //calls the function in app.js
        }, 400);
        cancelAnimationFrame(myReq); // where myReq = win.requestAnimationFrame(main)

    }
}

/**-------------------------------------------------------------------MY CODE ENDS------------------------------------------------------------ */
/**-------------------------------------------------------------------------------------------------------------------------------------------- */


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-horn-girl.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
