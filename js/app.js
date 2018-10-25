/**------------------------------------------------------------------------------------------------------------------------------- */
/**------------------------------------------------------------DECLARATIONS------------------------------------------------------- */

const score = document.querySelector(".score"); //to record and display score made by player
const caught = document.querySelector(".timesCaught"); //to record and display player-vehicle collision
const modal = document.getElementById("popup"); //to show a popup before playing and after game is over
const stats = document.querySelector('.stats'); //for manuplating content inside modal
const modal_title = document.querySelector('.modal_title'); //for manuplating content inside modal
let scoreStatus = 0; //a counter to record score made by player
let hitBug = 0; //a counter to record player-vehicle collision
/**--------------------------------------------------------------DECLARATION ENDS-------------------------------------------------- */

/**-------------------------------------------------------------------------------------------------------------------------------- */
/**---------------------------------------------------------------FUNCTION DECLARATION---------------------------------------------- */

/**@description functions called  1.after clicking rules button 2.after winning(i.e score=5)the game 3.after losing the game(i.e caught=10)
 * to show modal, each modal displayed by fuctions 1,2,3 have different text content displayed to reflect its purpose
 * @param {string} querySelector class with modal and button classes
 * @returns displays 1.Instructions to play the game. 2.Winner score and caught score 3. losing score
 */
//TODO: show a popup modal displaying Instructions about the game when the Rules button is clicked.
//this function is called by the event listener for rules
//1.Modal to show - Instructions to play the game when rules button is clicked
function ruleModal() {
    modal.classList.toggle('hide', false);
    stats.style.textAlign = 'left';
    stats.style.paddingLeft = '20px';
    modal_title.textContent = 'Instructions';
    //manipulation the text to be displayed by the rules modal using ES6 template Literals
    stats.innerHTML = `<p>1. Move the Player using Arrow keys or W A S D</p>
    <p>2. Score a point by reaching the water at the top</p>
    <p>3. To win the game , Score 5 points</p>
    <p>4. You lose a point if you hit a bug</p>
    <p>5. If bugs catch you 10 times, You Lose. &nbsp; Good Luck!</p>`
}
//2.Modal to show- Winner score and caught score when player wins
function winModal() {
    modal_title.textContent = 'Game Won!';
    stats.style.textAlign = 'center';
    //manipulation of the text to be displayed by the win modal using ES6 template Literals
    stats.innerHTML = `<p>You Won!Congrats</p>
    <p> Your Score 5</p>
    <p>You got caught ${hitBug} time(s)</p>
    <p>Play again and don't let those bug catch you!</p>`; //displays the scorestatus and times caught by bug in the modal
}
//3.Modal to show- losing score when player loses
function gameOver() {
    modal_title.textContent = 'Game Over!';
    stats.style.textAlign = 'center';
    //manipulation of the text to be displayed by the lose modal using ES6 template Literals
    stats.innerHTML = `<p>Oh no! The bugs caught you <p>
    <p>You Lose!</p>
    <p>You scored ${scoreStatus} point(s)<p>
    <p>Play again and don't let those bug catch you!</p>`; //displays the scorestatus in the modal
}
/**------------------------------------------------------------------------------------------------------------------------------- */

/**------------------------------------------------------------------------------------------------------------------------------- */
/**-----------------------------------------------------------------ES6 CLASS DECLARATION----------------------------------------- */
/**@description leader class declaration
 * @constructor
 * @param {number} x which gives x-axis of the sprite containing image & used by render() method
 * @param {number} y which gives y a-axis of the sprite containing image & used by render() method
 * @param {number} speed to give a inital speed to the enemy and player object
 * @returns locate the sprite image using x and y position and renders that on the game board
 * Ref -https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */
class Leader {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//creating a player class which inherits characterstic from its main class leader sing the *extend* keyword
// create child class and extend our parent class
class Player extends Leader {
    constructor(x, y, speed) {
        // invoke our parent constructor function passing in any required parameters
        //To avoid ReferenceError: must call super constructor before using 'this' in Player class constructor
        super(x, y, speed);
        this.sprite = 'images/char-horn-girl.png';
    }
    update(dt) {
        this.speed * dt;
    }
    //called by checkCollisons() in engine.js when player-vehicle collison occurs and by handleInput() when player reaches water
    //reset the players position to inital value set
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
    //Using the method definition shorthand introduced in ES6
    reset() {
        this.x = 202;
        this.y = 405;
        this.speed = 100;
    }

    /**@description this method is called if player reaches water i.e y< 0.
     * @param {number} scoreStatus a counter to store score made by the player
     * @returns scoreStatus which displays the score on the screen.
     */
    scoreBoard() {
        scoreStatus++;
        if (scoreStatus < 5) { //if score is less than 5 just update the score on the screen
            score.innerHTML = `${scoreStatus}`;
        }
    }

    /**@description A method called by the event handles which listens for keycodes
     * @param {string} var allowed keys containing key codes declared by us(keyInput)
     * @returns our player can move based on the key pressed and boundry set
     */
    handleInput(keyInput) {
        //whole width =505
        //whole height =606
        //rows=6(1 row water, 3 rows stones,2 rows grass)
        //colums =5
        //[1] per block width x axis =>83 from engine.js ctx
        //[1]per block width y axis=>101 from engine.js ctx
        //[2]this value are determined by width/rows & height/colums with neglecting the padding to adjust the player to be at the center of the blocks
        //[3] to get the values of 101 & 83, also we set the left boundary with x & y as (0,0)
        //[4]so as min x & y should be greater than zero and max x & y should be less than 405 & 404 respectively
        //based on above[3][4] min and max conditions move the player on x & y using per block width from[1]
        //for writing concise code we use switch case and ternary operation, as the conditions are simpler switch case is better suited
        switch (keyInput) {
            case 'left':
            case 'a':
                this.x = this.x > 0 ? this.x - 101 : this.x;
                break;

            case 'right':
            case 'd':
                this.x = this.x < 404 ? this.x + 101 : this.x;
                break;

            case 'up':
            case 'w':
                this.y = this.y > 0 ? this.y - 83 : this.y;
                break;

            case 'down':
            case 's':
                this.y = this.y < 405 ? this.y + 83 : this.y;
                break;

        }

        //win position is determine using the top row containg waters y position, which is 0, so if player reaches top
        //its y position will be less than zero,in that case call the reset method and scoreBoard method.
        if (this.y < 0) {
            setTimeout(() => {
                this.reset();
            }, 150);
            this.scoreBoard();
        }
    }
}
//instantiate our player object
const player = new Player(202, 405, 100);

//creating a Enemy class which inherits characterstic from its main class leader using the *extend* keyword
// create child class and extend our parent class
class Enemy extends Leader {
    constructor(x, y, speed) {
        super(x, y, speed);
        this.x = x - 150;
        this.sprite = 'images/enemy-bug.png';
    }
    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 505) {
            this.x = -101; //if enemy goes off the board,give it a x position to show them coming from left side which
            //creates an looping of running enemy on and off game board
            this.speed = 150 + (Math.floor(Math.random() * 351)); //also randomize their speed while coming from left side
        }
    }
}

/**allEnemies-
 * so we declare an array which contains the value of the y position we want our bugs to be at,we want x position at 0
 * for all 3 bugs, with different y position, so we give those y values to an array enemyYPosition then we want
 * for each of those y values along with x = 0 and a speed, to be pushed inside the array allEnemies.
 * the function which takes yPosition has the parameter, and is passed through each array element and we instantiate a new
 * object enemy with class Enemy and push those to the array
 */
//declare an array to give different y position to enemy
//adjusted numbers to make the bugs move across board with some padding and center alignment
let enemyYPostion = [63, 145, 228];
//declare an array to hold all the enemy objects
const allEnemies = [];
enemyYPostion.forEach(yPosition => {
    //instantiate our enemy objects
    const enemy = new Enemy(0, yPosition, 150 + Math.floor(Math.random() * 412)); //give each enemy random speed
    allEnemies.push(enemy); //allEnemies array contains 3 enemy objects with given position and varying speed
});

/**------------------------------------------------------------------------------------------------------------------------------- */

/**-------------------------------------------------EVENT LISTENER FOR KEYBOARD INPUT--------------------------------------------- */
// This listens for key presses and sends the keys to Player.handleInput() method.
//reference https://keycode.info/
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        68: 'd',
        87: 'w',
        83: 's',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
/**------------------------------------------------------------------------------------------------------------------------------- */

/**------------------------------------------------------------------------------------------------------------------------------- */
//In order to prevnt the defaut function of the up and down arrow keys when pressed in the window which is to scroll the screen up or down
//prevent that from happening by giving an event listener to those keys, up =38 & down =40
window.addEventListener('keydown', function (e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
    }
}, false);

/**------------------------------------------------------------------------------------------------------------------------------- */