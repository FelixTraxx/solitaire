import {Game} from './game.js';

var solitaire;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function setupBoard() {

    solitaire = new Game();

}

window.setupBoard = setupBoard;
window.getRandomIntInclusive = getRandomIntInclusive;
window.solitaire = solitaire;

