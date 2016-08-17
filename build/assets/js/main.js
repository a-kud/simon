//"use strict";

var Simon = {

    gameStarted: false,
    round: 0,
    buttonsToLight: [],

    init() {
        console.log("To be implemented.");
    },

    /**
     * Appends random numbers to buttonsToLight ArrayBuffer
     */
    generateButtonSequence() {

        this.resetButtonsToLight();

		for (let i = 0; i <= this.round; i += 1) {
			this.buttonsToLight.push( this.getRandomInt(0, 3) );
		}
    },

    /**
     * Returns current round number.
     * @returns {Number} - Round number
     */
    getRound() {
        return this.round;
    },

    /**
     * Increments 'round' property as game progresses
     */
    incrementRound() {
        let currRound = this.getRound();
        this.round = currRound + 1;
    },

    /**
     * Resets round to default
     */
    resetRound() {
        this.round = 0;
    },

    /**
     * Resets buttonsToLight array.
     */
    resetButtonsToLight() {
        this.buttonsToLight.length = 0;
    },

    // Helper functions
    /**
     * Returns a random number between 0 (inclusive) and 1 (exclusive)
     * @returns {Number} Float number
     */
    getRandom() {
        return Math.random();
    },

    /**
     * Returns a random integer between min (included) and max (excluded)
     * @param {Number} min - Non-negative integer
     * @param {Number} max - Positive integer
     * @returns {Number} Non-negative integer
     */
    getRandomInt(min, max) {
        return Math.floor( (this.getRandom() * max - min) ) + min;
    }
};

Simon.init();
/*Simon.incrementRound();
Simon.incrementRound();
Simon.incrementRound();
Simon.incrementRound();
Simon.incrementRound();
Simon.generateButtonSequence();*/
