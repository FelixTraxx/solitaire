const index = require('../index.js');

beforeEach(() => {

    document.body.innerHTML = 
    '<div>' + 
    '<div id="gameboard">' +
    '<div id="cardpile"></div>' + 
    '<div id="showpile"></div>' + 
    '<div id="target1"></div>' + 
    '<div id="target2"></div>' + 
    '<div id="target3"></div>' + 
    '<div id="target4"></div>' + 
    '<div id="pile1"></div>' +
    '<div id="pile2"></div>' +
    '<div id="pile3"></div>' +
    '<div id="pile4"></div>' +
    '<div id="pile5"></div>' +
    '<div id="pile6"></div>' +
    '<div id="pile7"></div>' +
    '<button id="resetGame" >Reset Game</button>' +
    '<div id="modal" class="modal">' +
    '<span id="modal-close"></span>'
    '</div>' +
    '</div>' +
    '</div>';

});

test('Random number between 1 and 10', () => {
    expect(getRandomIntInclusive(1,10)).toBeLessThanOrEqual(10);
});

test('SetupBoard test', () => {
    setupBoard();
    expect(index.solitaire).not.toBe(null);
});

