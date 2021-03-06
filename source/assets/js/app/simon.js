"use strict";
let padStart = require('pad-start');

let startBtn = document.querySelector("#start"),
    strictBtn = document.querySelector("#strict"),
    sw = document.querySelector(".toggle--checkbox"),
    rnd = document.querySelector("#round");

let colorButtons = {
    0: "red",
    1: "blue",
    2: "green",
    3: "yellow"
},
    audioButtons = {
        0: "assets/sound/simonSound1.mp3",
        1: "assets/sound/simonSound2.mp3",
        2: "assets/sound/simonSound3.mp3",
        3: "assets/sound/simonSound4.mp3"
    };

let settings = function() {
    let round = 1,
        gameOn = false,
        gameStarted = false,
        strict = false;

	function getRound() {
		return round;
	}

    function getStatus() {
        return {on: gameOn, started: gameStarted, strict: strict};
    }

    function toggleStatus() {
        if (!gameOn) {
            gameOn = true;
        } else {
            gameOn = false;
        }
    }

    function gameInProgress() {
        gameStarted = true;
    }

    function gameEnded() {
        gameStarted = false;
    }

	function resetRoundAndSequence() {
		round = 1;
        sequence = undefined;
	}

	function incrementRound() {
		round += 1;
	}

    function toggleStrict() {
        strict ? strict = false : strict = true
    }

	return {
		round: getRound,
		reset: resetRoundAndSequence,
		incrementR: incrementRound,
        gameStatus: getStatus,
        onoff: toggleStatus,
        strict: toggleStrict,
        startGame: gameInProgress,
        endGame: gameEnded
	};
}();

let sequence;

sw.addEventListener("click", function swtichToggled() {
    init();
});

/**
 * Initiates game start/stop
 */
function init() {
    if ( !settings.gameStatus().on ) {
        settings.onoff();
        setText(rnd, "ON");
        startBtn.addEventListener( "click", playRound);
        strictBtn.addEventListener( "click", playRound);
        sequence = generateSequence(settings.round())
    } else {
        settings.onoff();
        settings.endGame();
        settings.reset();
        setText(rnd, "");
        startBtn.removeEventListener( "click", playRound );
        strictBtn.removeEventListener( "click", playRound );
        cloneNodesAndReplace();
    }

}

/**
 * Lights up color buttons in random order
 */
function playRound(e) {

    /**
     * @returns {Array.<Object>} - Array of functions to be executed
     */
    function computerTurn(arr) {
        let promises = [];

        arr.forEach( (num) => {
            promises.push(function() {
                    return playSound(audioButtons[num], num)
                                .then( () => {
                                    return Promise.resolve(sleep(1000).then(offBtnLight(colorButtons[num])));
                                });

                });
        });

        return promises;
    }

    /**
     * Manages game according to user's input
     */
    function userClicks(e) {
        console.log("sequence in userClicks: ", sequence);

        function clickCount() {
            count += 1;
            return count;
        }

        function resetGame() {
            settings.reset();
            setText(rnd, padStart( settings.round(), 2, "0" ));
            sequence = generateSequence(settings.round());
            computerPromises = computerTurn(sequence);
        }

        clickCount();

        let btnClicked = getKeyByValue(colorButtons, e.target.classList[0]),
            soundUrl = audioButtons[btnClicked];
        let choise = (sequence[count] == btnClicked);
        let setRound = () => setText(rnd, padStart(settings.round(), 2, "0"));

        if (!choise) {
            setText(rnd, "ER");
            count = -1;
            correctChoise = 0;
            if (settings.gameStatus().strict) {
                resetGame();
            }
            playSound(soundUrl, btnClicked)
                .then( () => { return Promise.resolve(sleep(1000)
                    .then(offBtnLight( colorButtons[btnClicked] )))
                             })
                .then( () => { executePromisesSeq( computerPromises); })
                .then( () => { setRound(); });
        }
        else if(choise) {
            correctChoise += 1;
            playSound(soundUrl, btnClicked)
                .then( () => { return Promise.resolve(sleep(1000)
                    .then(offBtnLight(colorButtons[btnClicked])))
                })
        }
        if (correctChoise == settings.round()) {
            settings.incrementR();
            count = -1;
            correctChoise = 0;
            sequence.push(getRandomInt(0, 4))
            computerPromises = computerTurn(sequence);
            sleep(1500).then( () => { setRound();} )
                .then( () => { executePromisesSeq(computerPromises); } )
        }
        if (settings.round() == 21) {

            alert("Lucky you! It's a win.");
            resetGame();
        }
    }

    let count = -1;
    let correctChoise = 0;

    let computerPromises;

    let colorBtns = document.querySelectorAll(".color-btn"),
        ledBox = document.querySelector(".led-box");

    setText(rnd, padStart( settings.round(), 2, "0" ));
    if (e.target.id == "strict") {
        if (!settings.gameStatus().strict) {
            settings.strict();
            toggleClass(ledBox, "led-box-on");
        }
    } else {
        if (settings.gameStatus().strict) {
            settings.strict();
            toggleClass(ledBox, "led-box-on");
        }
    }

    if ( !settings.gameStatus().started ) {
        computerPromises = computerTurn(sequence);
    } else {
        settings.reset();
        setText(rnd, padStart( settings.round(), 2, "0" ));
        sequence = generateSequence(settings.round());
        computerPromises = computerTurn(sequence);
        [...colorBtns].forEach( (btn) => btn.removeEventListener("click", userClicks) );
    }

    executePromisesSeq(computerPromises).then( () => {
        if (!settings.gameStatus().started) {
            [...colorBtns].forEach( (btn) => btn.addEventListener("click", userClicks) );
            settings.startGame();
        }
    } );
}

/**
 * Changes backround of color button to idicate activated button
 * @param {String} btn - Class name
 */
function lightBtn(btn) {
    let element = document.querySelector("." + btn)
    element.classList.add("activated-" + btn);
}

/**
 * Changes backround of color button to idicate deactivated button
 * @param {String} btn - Class name
 */
function offBtnLight(btn) {
    let element = document.querySelector("." + btn)
    element.classList.remove("activated-" + btn);
}

/**
 * Plays specified audiofile and lights button
 * @param {String} path - Path to the file
 */
function playSound(path, num) {
    return new Promise(function (resolve, reject) {
        let audio = new Audio(path);
        lightBtn(colorButtons[num]);
        audio.load();
        audio.play();
        audio.onended = resolve;
        audio.onerror = reject;
    })
}

/**
 * @param {Number} n - Nonnegative integer
 * @returns {Array} - Array of pseudorandom nonnegative integers
 */
 function generateSequence(n) {
     return createArray(n).map(() => getRandomInt(0, 4));
 }

// Helper functions
/**
 * Creates empty array if specified length
 * @param {Number} length - positive integer
 * @returns {Array}
 */
 function createArray(length) {
     return [...new Array(length)];
 }

/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive)
 * @returns {Number} - Float number
 */
function getRandom() {
    return Math.random();
}

/**
 * Returns a random integer between min (included) and max (excluded)
 * @param {Number} min - Non-negative integer
 * @param {Number} max - Positive integer
 * @returns {Number} Non-negative integer
 */
function getRandomInt(min, max) {
    return Math.floor( (getRandom() * max - min) ) + min;
}

/** Sets a pause.
 * @param {Number} duration - Time in ms
 * @returns {Object} Promise that resolves after specified time
 */
function sleep(duration)
	{
	return(
		new Promise(function(resolve)
			{
			setTimeout(function() { resolve(); }, duration);
			})
		);
	}

/**
 * Returns the first key that has specified value
 * @param {Object} object
 * @param value
 * @returns {String|undefined} First key with specified value or undefined if
 * no key found
 */
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

/**
 * Executes promises sequentially
 * @param {Array.<Object>} - Array of Promise returning functions.
 * @returns {Object} - Executing promise.
 */
function executePromisesSeq(promises) {
    let  result = Promise.resolve();

    promises.forEach(function (prom) {
        result = result.then(prom);
    });

    return result;
}

/**
 * Sets the text content of a node and its descendants.
 * @param {Object} element - DOM element object.
 * @param {String} text - Content to be set.
 */
function setText(element, text) {
    element.textContent = text;
}

function cloneNodesAndReplace() {
    let colorBtns = document.querySelectorAll(".color-btn");
    let clones = [...colorBtns].map( (el) => el.cloneNode() );
    [...colorBtns].forEach( (el, idx) => {
        el.parentNode.replaceChild(clones[idx], el);
    });
}

/**
 * @param {String} classNames - Arbitrary number of class names.
 * @param {Object} element - Object of document.
 */
function toggleClass(element, ...classNames) {
    let classList = element.classList;
    [...classNames].forEach( (el) => classList.toggle(el) );
}
