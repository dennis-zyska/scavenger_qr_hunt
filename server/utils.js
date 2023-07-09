/**
 * Randomizes the order of the objects and gives the repeated indices in the length of x
 * @param objects - array of objects - List of objects
 * @param x - number - Number of minimal indices to be returned
 * @return {*[]}
 */
const randomizeAndRepeatIndices = (objects, x) => {
    let indices = [];
    while (indices.length < x) {
        let randomizedIndices = [...objects.keys()].sort(() => Math.random() - 0.5);
        indices = [...indices, ...randomizedIndices];
    }
    return indices.slice(0, x);
}

/**
 * Generate a random string of size
 * @param size - number - Size of the string to be generated
 * @return {string}
 */
const generateRandomString = (size) => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Checks if the answer is correct, use levensthein distance to check for close matches
 * @param answer
 * @param solutions
 * @return {boolean}
 */
const checkAnswer = (answer, solutions) => {
    // lower case
    answer = answer.toLowerCase();

    // check if exact match
    if (solutions.map(s => s.toLowerCase()).includes(answer)) {
        return true;
    }

    // check for minium edit distance using the Wagner-Fischer algorithm
    for (let i = 0; i < solutions.length; i++) {
        const correctAnswer = solutions[i].toLowerCase();
        const mED = minimumEditDistance(answer, correctAnswer);
        if (mED <= 2) {
            return true;
        }
    }

    // No exact match or close match found
    return false;

}

/**
 * Randomly assigns the elements of an array to x groups
 * @param arr
 * @param x
 * @return {*[]}
 */
const randomAssign = (arr, x) => {
    let shuffled = arr.slice(0); // create a copy of the original array
    let result = [];

    // shuffle the array - Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    let current_group = 0;
    for (let g = 0; g < x; g++) {
        result.push([]);
    }
    for (let i = 0; i < shuffled.length; i++) {
        result[current_group].push(shuffled[i]);
        current_group += 1;
        if (current_group >= x) current_group = 0;
    }

    return result;
}


/**
 * Returns the minimum edit distance between two strings
 * @param a
 * @param b
 * @return {*}
 */
const minimumEditDistance = (a, b) => {
    const m = a.length;
    const n = b.length;

    // Create a 2d array to store the minium edit distance
    const d = [];
    for (let i = 0; i <= m; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        d[0][j] = j;
    }

    // Fill the 2d array using wagner-fischer algorithm
    for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= m; i++) {
            if (a[i - 1] === b[j - 1]) {
                d[i][j] = d[i - 1][j - 1];
            } else {
                d[i][j] = Math.min(
                    d[i - 1][j] + 1, // deletion
                    d[i][j - 1] + 1, // insertion
                    d[i - 1][j - 1] + 1 // substitution
                );
            }
        }
    }

    // return the minium edit distance between the two strings
    return d[m][n];

}

module.exports = {
    randomizeAndRepeatIndices,
    generateRandomString,
    checkAnswer,
    randomAssign,
    minimumEditDistance
}