(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function (string, maxLength, fillString) {

  if (string == null || maxLength == null) {
    return string;
  }

  var result    = String(string);
  var targetLen = typeof maxLength === 'number'
    ? maxLength
    : parseInt(maxLength, 10);

  if (isNaN(targetLen) || !isFinite(targetLen)) {
    return result;
  }


  var length = result.length;
  if (length >= targetLen) {
    return result;
  }


  var fill = fillString == null ? '' : String(fillString);
  if (fill === '') {
    fill = ' ';
  }


  var fillLen = targetLen - length;

  while (fill.length < fillLen) {
    fill += fill;
  }

  var truncated = fill.length > fillLen ? fill.substr(0, fillLen) : fill;

  return truncated + result;
};

},{}],2:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var padStart = require('pad-start');

var startBtn = document.querySelector("#start"),
    strictBtn = document.querySelector("#strict"),
    sw = document.querySelector(".toggle--checkbox"),
    rnd = document.querySelector("#round");

var colorButtons = {
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

var settings = function () {
    var round = 1,
        gameOn = false,
        gameStarted = false,
        strict = false;

    function getRound() {
        return round;
    }

    function getStatus() {
        return { on: gameOn, started: gameStarted, strict: strict };
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
        strict ? strict = false : strict = true;
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

var sequence = void 0;

sw.addEventListener("click", function swtichToggled() {
    init();
});

/**
 * Initiates game start/stop
 */
function init() {
    if (!settings.gameStatus().on) {
        settings.onoff();
        setText(rnd, "ON");
        startBtn.addEventListener("click", playRound);
        strictBtn.addEventListener("click", playRound);
        sequence = generateSequence(settings.round());
    } else {
        settings.onoff();
        settings.endGame();
        settings.reset();
        setText(rnd, "");
        startBtn.removeEventListener("click", playRound);
        strictBtn.removeEventListener("click", playRound);
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
        var promises = [];

        arr.forEach(function (num) {
            promises.push(function () {
                return playSound(audioButtons[num], num).then(function () {
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
            setText(rnd, padStart(settings.round(), 2, "0"));
            sequence = generateSequence(settings.round());
            computerPromises = computerTurn(sequence);
        }

        clickCount();

        var btnClicked = getKeyByValue(colorButtons, e.target.classList[0]),
            soundUrl = audioButtons[btnClicked];
        var choise = sequence[count] == btnClicked;
        var setRound = function setRound() {
            return setText(rnd, padStart(settings.round(), 2, "0"));
        };

        if (!choise) {
            setText(rnd, "ER");
            count = -1;
            correctChoise = 0;
            if (settings.gameStatus().strict) {
                resetGame();
            }
            playSound(soundUrl, btnClicked).then(function () {
                return Promise.resolve(sleep(1000).then(offBtnLight(colorButtons[btnClicked])));
            }).then(function () {
                executePromisesSeq(computerPromises);
            }).then(function () {
                setRound();
            });
        } else if (choise) {
            correctChoise += 1;
            playSound(soundUrl, btnClicked).then(function () {
                return Promise.resolve(sleep(1000).then(offBtnLight(colorButtons[btnClicked])));
            });
        }
        if (correctChoise == settings.round()) {
            settings.incrementR();
            count = -1;
            correctChoise = 0;
            sequence.push(getRandomInt(0, 4));
            computerPromises = computerTurn(sequence);
            sleep(1500).then(function () {
                setRound();
            }).then(function () {
                executePromisesSeq(computerPromises);
            });
        }
        if (settings.round() == 21) {

            alert("Lucky you! It's a win.");
            resetGame();
        }
    }

    var count = -1;
    var correctChoise = 0;

    var computerPromises = void 0;

    var colorBtns = document.querySelectorAll(".color-btn"),
        ledBox = document.querySelector(".led-box");

    setText(rnd, padStart(settings.round(), 2, "0"));
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

    if (!settings.gameStatus().started) {
        computerPromises = computerTurn(sequence);
    } else {
        settings.reset();
        setText(rnd, padStart(settings.round(), 2, "0"));
        sequence = generateSequence(settings.round());
        computerPromises = computerTurn(sequence);
        [].concat(_toConsumableArray(colorBtns)).forEach(function (btn) {
            return btn.removeEventListener("click", userClicks);
        });
    }

    executePromisesSeq(computerPromises).then(function () {
        if (!settings.gameStatus().started) {
            [].concat(_toConsumableArray(colorBtns)).forEach(function (btn) {
                return btn.addEventListener("click", userClicks);
            });
            settings.startGame();
        }
    });
}

/**
 * Changes backround of color button to idicate activated button
 * @param {String} btn - Class name
 */
function lightBtn(btn) {
    var element = document.querySelector("." + btn);
    element.classList.add("activated-" + btn);
}

/**
 * Changes backround of color button to idicate deactivated button
 * @param {String} btn - Class name
 */
function offBtnLight(btn) {
    var element = document.querySelector("." + btn);
    element.classList.remove("activated-" + btn);
}

/**
 * Plays specified audiofile and lights button
 * @param {String} path - Path to the file
 */
function playSound(path, num) {
    return new Promise(function (resolve, reject) {
        var audio = new Audio(path);
        lightBtn(colorButtons[num]);
        audio.load();
        audio.play();
        audio.onended = resolve;
        audio.onerror = reject;
    });
}

/**
 * @param {Number} n - Nonnegative integer
 * @returns {Array} - Array of pseudorandom nonnegative integers
 */
function generateSequence(n) {
    return createArray(n).map(function () {
        return getRandomInt(0, 4);
    });
}

// Helper functions
/**
 * Creates empty array if specified length
 * @param {Number} length - positive integer
 * @returns {Array}
 */
function createArray(length) {
    return [].concat(_toConsumableArray(new Array(length)));
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
    return Math.floor(getRandom() * max - min) + min;
}

/** Sets a pause.
 * @param {Number} duration - Time in ms
 * @returns {Object} Promise that resolves after specified time
 */
function sleep(duration) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, duration);
    });
}

/**
 * Returns the first key that has specified value
 * @param {Object} object
 * @param value
 * @returns {String|undefined} First key with specified value or undefined if
 * no key found
 */
function getKeyByValue(object, value) {
    return Object.keys(object).find(function (key) {
        return object[key] === value;
    });
}

/**
 * Executes promises sequentially
 * @param {Array.<Object>} - Array of Promise returning functions.
 * @returns {Object} - Executing promise.
 */
function executePromisesSeq(promises) {
    var result = Promise.resolve();

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
    var colorBtns = document.querySelectorAll(".color-btn");
    var clones = [].concat(_toConsumableArray(colorBtns)).map(function (el) {
        return el.cloneNode();
    });
    [].concat(_toConsumableArray(colorBtns)).forEach(function (el, idx) {
        el.parentNode.replaceChild(clones[idx], el);
    });
}

/**
 * @param {String} classNames - Arbitrary number of class names.
 * @param {Object} element - Object of document.
 */
function toggleClass(element) {
    var classList = element.classList;

    for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        classNames[_key - 1] = arguments[_key];
    }

    [].concat(classNames).forEach(function (el) {
        return classList.toggle(el);
    });
}

},{"pad-start":1}]},{},[2])


//# sourceMappingURL=main.js.map
