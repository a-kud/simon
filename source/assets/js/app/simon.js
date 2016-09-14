// use strict;

let startBtn = document.querySelector("#start"),
    strictBtn = document.querySelector("#strict"),
    sw = document.querySelector(".switch"),
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

let gameStarted = false,
    round = 3;

sw.addEventListener("click", function swtichToggled() {
    init();
});

function addCtrlBtnsListeners() {
    startBtn.addEventListener( "click", playRound );
    strictBtn.addEventListener( "click", playRound );
}

function rmCtrlBtnsListeners() {
    startBtn.removeEventListener( "click", playRound );
    strictBtn.removeEventListener( "click", playRound );
}

/*function userClicks(e) {
    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    for(let i=0; i<=sequence.length; i++) {
        console.log( getKeyByValue(colorButtons, e.target.classList[0]) == sequence[i] )
    }
    // console.log(e.target.classList);
}*/

function addColorBtnsLstnrs(seq) {

    function userClicks(e) {
        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }

        for(let i=0; i<=sequence.length; i++) {
            console.log( getKeyByValue(colorButtons, e.target.classList[0]) == sequence[i] )
        }
        // console.log(e.target.classList);
    }

    let colorBtns = document.querySelectorAll(".color-btn");
    let sequence = seq;
    console.log(sequence)
    colorBtns.forEach( (btn) => btn.addEventListener("click", userClicks) );

}

/**
 * Initiates game start/stop
 */
function init() {
    if (!gameStarted) {
        gameStarted = true;
        rnd.textContent = "00";
        addCtrlBtnsListeners();
    } else {
        gameStarted = false;
        resetRound();
        rnd.textContent = "";
        rmCtrlBtnsListeners();
    }

}

/**
 * Lights up color buttons in random order
 */
function playRound() {

    let sequence = generateSequence(round);
    console.log(
        sequence.map((num) => colorButtons[num])
    )

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

    /*
        Add event listeners to color buttons
        If event.target code equals corresponding one in sequence proceed or,
        in other case show computerTurn again
        Play button sound
        If all buttons are pressed increment round
        Remove event listeners to color buttons
        Run computerTurn
    */
    function userTurn(sequence) {
        addColorBtnsLstnrs(sequence);
    }

    function executePromisesSeq(promises) {
        let  result = Promise.resolve();

        promises.forEach(function (prom) {
            result = result.then(prom);
        });

        return result;
    }

    let computerPromises = computerTurn(sequence);

    executePromisesSeq(computerPromises).then(() => { userTurn(sequence); });

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

/** Plays specified audiofile
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
 * @param {Number} round - Nonnegative integer
 * @returns {Array} - Array of pseudorandom nonnegative integers
 */
 function generateSequence(round) {
     return createArray(round).map(() => getRandomInt(0, 4));
 }

/**
 * Returns current round number.
 * @returns {Number} - Round number
 */
function getRound() {
    return round;
}

/**
 * Increments round count as game progresses
 */
function incrementRound() {
    let currRound = getRound();
    round = currRound + 1;
}

/**
 * Resets round to default
 */
function resetRound() {
    round = 0;
}

// Helper functions
/**
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

/** Sets a pause in milliseconds.
 * @param {Number} duration - Time in ms
 */
function sleep(duration)
	{
	return(
		new Promise(function(resolve, reject)
			{
			setTimeout(function() { resolve(); }, duration);
			})
		);
	}
