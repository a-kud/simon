// use strict;

let startBtn = document.querySelector("#start"),
    strictBtn = document.querySelector("#strict"),
    sw = document.querySelector(".switch");

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
    round = 2;

sw.addEventListener("click", function swtichToggled() {
    console.log("on/off switch pressed")
    init();
});
function handler() {
    activateButtons();
}
function addCtrlBtnsListeners() {
    startBtn.addEventListener( "click", handler );
    strictBtn.addEventListener( "click", handler );
}

function rmCtrlBtnsListeners() {
    startBtn.removeEventListener( "click", handler );
    strictBtn.removeEventListener( "click", handler );
}


function init() {
    if (!gameStarted) {
        gameStarted = true;
        addCtrlBtnsListeners();
    } else {
        gameStarted = false;
        resetRound();
        rmCtrlBtnsListeners();
    }

}

function activateButtons() {
    /*1. toggle activated class
    2. play corresponding sound for button*/
    generateButtonSequence().then( (arr) => {

        let promises = [];
        //
        // for (let num of arr) {
        //     promises.push(function() {
        //         lightBtn(colorButtons[num]);
        //         return playSound(audioButtons[num]).then( () => { offBtnLight(colorButtons[num]); });
        //     });
        //     console.log("Current sequence: ", colorButtons[num])
        // }
        //
        arr.forEach( (num) => {
            promises.push(function() {
                    lightBtn(colorButtons[num]);
                    return playSound(audioButtons[num]).then( () => { offBtnLight(colorButtons[num]); });
                });
            console.log("Current sequence: ", colorButtons[num])
        });
        return promises;


    }).then( (promises) => {

        let  result = Promise.resolve();
        promises.forEach(function (prom) {
            result = result.then(prom);

            });
        return result;
    });
}

function waitForUserTurn() {

}

/**
 * Changes backround of color button to idicate activated item
 */
function toggleBtnLight(btn) {
    let element = document.querySelector("." + btn)
    element.classList.toggle("activated-" + btn);
}

function lightBtn(btn) {
    let element = document.querySelector("." + btn)
    element.classList.add("activated-" + btn);
}

function offBtnLight(btn) {
    let element = document.querySelector("." + btn)
    element.classList.remove("activated-" + btn);
}

/** Plays specified audiofile
 * @param {String} path - Path to the file
 */
function playSound(path) {
    return new Promise(function playPromise(resolve, reject) {
        let audio = new Audio(path);
        audio.play();
        audio.onended = resolve;
        audio.onerror = reject;
    })
}
/**
 * Returns an array of color button as integers
 * @returns {ArrayBuffer} buttonsToLight
 */
function generateButtonSequence() {

    let buttonsToLight = [];

	for (let i = 0; i <= round; i += 1) {
		buttonsToLight.push( getRandomInt(0, 4) );
	}
    return Promise.resolve(buttonsToLight);
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
 * Returns a random number between 0 (inclusive) and 1 (exclusive)
 * @returns {Number} Float number
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
