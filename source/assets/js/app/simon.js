"use strict";

var Simon = {

    init() {
        console.log("To be implemented.");
    },

    // Helper functions
    /**
     * Returns a random number between 0 (inclusive) and 1 (exclusive)
     * @returns {Number} Float number
     */
    getRandom() {
    	return Math.random();
    }

    /**
     * Returns a random integer between min (included) and max (excluded)
     * @param {Number} min - Non-negative integer
     * @param {Number} max - Positive integer
     * @returns {Number} Non-negative integer
     */
    getRandomInt(min, max) {
    	return Math.floor( (getRandom() * max - min) ) + min;
    }

};

Simon.init();
