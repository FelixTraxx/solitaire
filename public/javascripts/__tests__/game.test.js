const { ExpectationFailed } = require('http-errors');
const { TestScheduler } = require('jest');
const index = require('../game.js');

let game = undefined;
let event = undefined;


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

    game = new index.Game();
    event = {};
});

test('constructor', () => {

    expect(game.element).not.toBeUndefined();
    expect(game.cardpile).not.toBeUndefined();
    expect(game.showpile).not.toBeUndefined();
    expect(game.piles.length).toBe(7);
    expect(game.targets.length).toBe(4);
    expect(game.cards.length).toBe(52);
    expect(game.pilesCompleted).toBe(0);
    expect(game.cardValueCompleted).toBe(0);

});

test('clickCardInCardPile', () => {

    let card = {};
    card.flipCard = function() {

    }

    event.type = 'cardclickwithpile';
    event.detail = {};
    event.detail.pileType = 'card';

    game.cardpile.removeLastCard = function() {
        return card;
    }

    game.showpile.addCard = function() {

    }

    const spyClickCardInCardPile = jest.spyOn(game, 'clickCardInCardPile');
    const spyFlipCard = jest.spyOn(card, 'flipCard');
    const spyRemoveLastCard = jest.spyOn(game.cardpile, 'removeLastCard');
    const spyAddCard = jest.spyOn(game.showpile, 'addCard');

    game.handleEvent(event);

    expect(spyClickCardInCardPile).toBeCalled();
    expect(spyRemoveLastCard).toBeCalled();
    expect(spyFlipCard).toBeCalled();
    expect(spyAddCard).toBeCalled();

});

test('clickCardInShowPile No Cards In Card Pile', () => {


    event.type = 'cardclickwithpile';
    event.detail = {};
    event.detail.pileType = 'show';

    let card = {};
    card.flipCard = function() {

    }

    game.cardpile.getSize = function() {
        return 0;
    }

    game.cardpile.addCard = function() {

    }

    game.showpile.getSize = function() {
        return 1;
    }

    game.showpile.removeLastCard = function() {
        return card;
    }


    const spyClickCardInShowPile = jest.spyOn(game, 'clickCardInShowPile');
    const spyFlipCard = jest.spyOn(card, 'flipCard');
    const spyAddCard = jest.spyOn(game.cardpile, 'addCard');

    game.handleEvent(event);

    expect(spyClickCardInShowPile).toBeCalled();
    expect(spyFlipCard).toBeCalled();
    expect(spyAddCard).toBeCalled();

});

test('clickCardInShowPile Cards In Card Pile', () => {


    event.type = 'cardclickwithpile';
    event.detail = {};
    event.detail.pileType = 'show';

    let card = {};
    card.flipCard = function() {

    }

    game.cardpile.getSize = function() {
        return 1;
    }

    game.cardpile.addCard = function() {

    }

    game.showpile.getSize = function() {
        return 1;
    }

    game.showpile.removeLastCard = function() {
        return card;
    }


    const spyClickCardInShowPile = jest.spyOn(game, 'clickCardInShowPile');
    const spyFlipCard = jest.spyOn(card, 'flipCard');
    const spyAddCard = jest.spyOn(game.cardpile, 'addCard');

    game.handleEvent(event);

    expect(spyClickCardInShowPile).toBeCalled();
    expect(spyFlipCard).not.toBeCalled();
    expect(spyAddCard).not.toBeCalled();

});

test('clickCardInPilePile Card is FaceDown', () => {

    let card = {};
    
    card.isFaceDown = function() {
        return true;
    }

    card.flipCard = function() {

    }

    event.type = 'cardclickwithpile';
    event.detail = {};
    event.detail.pileType = 'pile'; 
    event.detail.card = card;
    
    const spyFlipCard = jest.spyOn(card, 'flipCard');

    game.handleEvent(event);

    expect(spyFlipCard).toBeCalled();

});

test('clickCardInPilePile Card is FaceUp', () => {

    let card = {};
    
    card.isFaceDown = function() {
        return false;
    }

    card.flipCard = function() {

    }

    event.type = 'cardclickwithpile';
    event.detail = {};
    event.detail.pileType = 'pile'; 
    event.detail.card = card;
    
    const spyFlipCard = jest.spyOn(card, 'flipCard');

    game.handleEvent(event);

    expect(spyFlipCard).not.toBeCalled();

});

test('handleCardDragStartWithPile', () => {

    event.type = 'carddragstartwithpile';
    event.detail = {};

    game.handleEvent(event);

    expect(game.dragData).toBe(event.detail);

});

test('handleCardDropWithPile Pile to Empty Target other targets empty', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = undefined;

    // Card to Drop from Pile Pile
    let dropCard = {};

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 1;
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 0;
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(0);

});

test('handleCardDropWithPile Pile to Empty Target, other targets full, No Cards for next value', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = undefined;

    // Card to Drop from Pile Pile
    let dropCard = {};

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 1;
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 1;
    }

    game.moveNextValue = function() {
        return 0;
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');
    const spyMoveNextValue = jest.spyOn(game,'moveNextValue');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(1);
    expect(spyMoveNextValue).toHaveReturnedWith(0);

});

test('handleCardDropWithPile Pile to Empty Target, other targets full, Some Cards moved for Next Value', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = undefined;

    // Card to Drop from Pile Pile
    let dropCard = {};

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 1;
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 1;
    }

    game.moveNextValue = function() {
        return 3;
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');
    const spyMoveNextValue = jest.spyOn(game,'moveNextValue');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(1);
    expect(spyMoveNextValue).toHaveBeenCalledTimes(2);
    expect(spyMoveNextValue).toHaveReturnedWith(3);

});

test('handleCardDropWithPile Pile to Empty Target, other targets full, All Cards moved for Next Value', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = undefined;

    // Card to Drop from Pile Pile
    let dropCard = {};

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 1;
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 1;
    }

    let firstTimeNextValue = true;

    game.moveNextValue = function() {
        if(firstTimeNextValue) {
            firstTimeNextValue = false;
            return 3;
        }
        else {
            return 4;
        }
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');
    const spyMoveNextValue = jest.spyOn(game,'moveNextValue');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(1);
    expect(spyMoveNextValue).toHaveBeenCalledTimes(12);
    expect(spyMoveNextValue).toHaveReturnedWith(3);

});

test('handleCardDropWithPile Pile to Target with Card, other targets empty', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = {};
    card.suit = 'hearts';
    card.value = 1;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.suit = 'hearts'
    dropCard.value = 2;

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 2;
    game.dragData.card.suit = 'hearts';
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {

        return 0;
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(0);

});

test('handleCardDropWithPile Pile to Target with Card, other targets filled', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = {};
    card.suit = 'hearts';
    card.value = 1;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.suit = 'hearts'
    dropCard.value = 2;

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 2;
    game.dragData.card.suit = 'hearts';
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 1;
    }

    game.moveNextValue = function(nextValue) {
        return 0;
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(1);

});

test('handleCardDropWithPile Pile to Target with Card, other targets filled, Move Next Value', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = {};
    card.suit = 'hearts';
    card.value = 1;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.suit = 'hearts'
    dropCard.value = 2;

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 2;
    game.dragData.card.suit = 'hearts';
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 1;
    }

    game.moveNextValue = function(nextValue) {
        return 3;
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');
    const spyMoveNextValue = jest.spyOn(game, 'moveNextValue');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(1);
    expect(spyMoveNextValue).toHaveBeenCalledTimes(2);

});

test('handleCardDropWithPile Pile to Target with Card, other targets filled, Move All Cards', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'target1';

    // Card on Target Pile
    let card = {};
    card.suit = 'hearts';
    card.value = 1;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.suit = 'hearts'
    dropCard.value = 2;

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'target';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }

    game.dragData = {};
    game.dragData.card = {};
    game.dragData.card.value = 2;
    game.dragData.card.suit = 'hearts';
    game.dragData.cards = [];
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'target1') {
            return toPile;
        }
    }

    game.highestTargetPilesFilled = function() {
        return 1;
    }

    let firstTime = true;
    game.moveNextValue = function(nextValue) {
        if(firstTime) {
            firstTime = false;
            return 3;
        }
        else {
            return 4;
        }
    }

    const spyHighestTargetPilesFilled = jest.spyOn(game,'highestTargetPilesFilled');
    const spyMoveNextValue = jest.spyOn(game, 'moveNextValue');

    game.handleEvent(event);

    expect(spyHighestTargetPilesFilled).toHaveReturnedWith(1);
    expect(spyMoveNextValue).toHaveBeenCalledTimes(12);

});

test('handleCardDropWithPile Pile to Pile with King to Empty Pile', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'pile2';

    // Card on Pile Pile
    let card = undefined;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.suit = 'hearts'
    dropCard.value = 13;

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'pile';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }
    toPile.addCardNextLevel = function() {

    }

    game.dragData = {};
    game.dragData.card = dropCard;
    game.dragData.cards = [];
    game.dragData.cards.push(dropCard);
    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'pile2') {
            return toPile;
        }
    }

    const spyGetTopCard = jest.spyOn(toPile,'getTopCard');
    const spyRemoveLastCard = jest.spyOn(fromPile,'removeLastCard');
    const spyAddCard = jest.spyOn(toPile,'addCard');
    const spyAddCardNextLevel = jest.spyOn(toPile,'addCardNextLevel');

    game.handleEvent(event);

    expect(spyGetTopCard).toHaveReturnedWith(card);
    expect(spyRemoveLastCard).toHaveReturnedWith(dropCard);
    expect(spyAddCard).toBeCalled();
    expect(spyAddCardNextLevel).not.toBeCalled();

});

test('handleCardDropWithPile Pile to Pile with King,Queen to Empty Pile', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'pile2';

    // Card on Drop Pile Pile
    let card = undefined;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.suit = 'hearts'
    dropCard.value = 13;

    let dropCard2 = {};
    dropCard2.suit = 'spades'
    dropCard2.value = 12;    

    let fromPile = {};
    fromPile.type = 'pile';
    fromPile.removeLastCard = function() {
        return dropCard;
    }

    let toPile = {};
    toPile.type = 'pile';
    toPile.getTopCard = function() {
        return card;
    }
    toPile.addCard = function() {

    }
    toPile.addCardNextLevel = function() {

    }

    game.dragData = {};
    game.dragData.card = dropCard;
    game.dragData.cards = [];
    game.dragData.cards.push(dropCard);
    game.dragData.cards.push(dropCard2);


    
    // From Pile Name
    game.dragData.pileName = 'pile1';

    game.getPile = function(name) {
        if(name === 'pile1') {
            return fromPile;
        }
        else if(name === 'pile2') {
            return toPile;
        }
    }

    const spyGetTopCard = jest.spyOn(toPile,'getTopCard');
    const spyRemoveLastCard = jest.spyOn(fromPile,'removeLastCard');
    const spyAddCard = jest.spyOn(toPile,'addCard');
    const spyAddCardNextLevel = jest.spyOn(toPile,'addCardNextLevel');

    game.handleEvent(event);

    expect(spyGetTopCard).toHaveReturnedWith(card);
    expect(game.dragData.card.value).toBe(13);
    expect(game.dragData.cards.length).toBe(2);
    expect(spyRemoveLastCard).toHaveBeenCalledTimes(2);
    expect(spyAddCard).toBeCalled();
    expect(spyAddCardNextLevel).toBeCalled();

});