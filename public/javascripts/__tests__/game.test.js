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

test('handleCardDropWithPile Pile to Pile with Black Queen to Red King', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'pile2';

    // Card on Drop Pile Pile
    let card = {};
    card.color = 'red';
    card.value = 13;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.color = 'black'
    dropCard.value = 12;
  

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

    const spyRemoveLastCard = jest.spyOn(fromPile,'removeLastCard');
    const spyAddCardNextLevel = jest.spyOn(toPile,'addCardNextLevel');

    game.handleEvent(event);

    expect(spyRemoveLastCard).toHaveBeenCalledTimes(1);
    expect(spyAddCardNextLevel).toBeCalled();

});

test('handleCardDropWithPile Pile to Pile with Black Queen to Black King', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'pile2';

    // Card on Drop Pile Pile
    let card = {};
    card.color = 'black';
    card.value = 13;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.color = 'black'
    dropCard.value = 12;
  

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

    const spyRemoveLastCard = jest.spyOn(fromPile,'removeLastCard');
    const spyAddCardNextLevel = jest.spyOn(toPile,'addCardNextLevel');

    game.handleEvent(event);

    expect(spyRemoveLastCard).not.toBeCalled();
    expect(spyAddCardNextLevel).not.toBeCalled();

});

test('handleCardDropWithPile Pile to Pile with Red Queen to Black King', () => {

    event.type = 'carddropwithpile';
    event.detail = {};
    // To Pile Name
    event.detail.pileName = 'pile2';

    // Card on Drop Pile Pile
    let card = {};
    card.color = 'black';
    card.value = 13;

    // Card to Drop from Pile Pile
    let dropCard = {};
    dropCard.color = 'red'
    dropCard.value = 12;
  

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

    const spyRemoveLastCard = jest.spyOn(fromPile,'removeLastCard');
    const spyAddCardNextLevel = jest.spyOn(toPile,'addCardNextLevel');

    game.handleEvent(event);

    expect(spyRemoveLastCard).toBeCalled();
    expect(spyAddCardNextLevel).toBeCalled();

});

test('handleButtonClick', () => {

    let event = {};
    event.type = 'buttonclick';

    game.resetGame = function() {

    }

    var spyResetGame = jest.spyOn(game, 'resetGame');

    game.handleEvent(event);

    expect(spyResetGame).toBeCalled();

});

test('resetGame', () => {

    var card = {};
    card.setZIndex = () => {};
    card.setTop = () => {};
    card.getElement = () => {};
    card.flipCard = () => {};

    game.piles = [];
    game.targets = [];

    let pilePile = {};
    pilePile.getSize = () => {};
    pilePile.addCard = () => {};
    game.piles.push(pilePile);

    let targetPile = {};
    targetPile.getSize = () => {};
    game.targets.push(targetPile);

    let cardPile = {};
    cardPile.getSize = () => 1;
    cardPile.removeLastCard = () => card;
    cardPile.addCard = () => {};
    game.cardpile = cardPile; 

    let showPile = {};
    showPile.getSize = () => 1;
    showPile.removeLastCard = () => card;
    game.showpile = showPile;     

    game.pilesCompleted = 4;

    game.resetGame();

    expect(game.pilesCompleted).toBe(0);


});

test('highestTargetPilesFilled', () => {
    game.areTargetPilesFilled = () => true;

    let targetPile = {};
    let topCard = {};
    topCard.value = 1;

    targetPile.getTopCard = () => topCard;
    targetPile.getSize = () => 1;

    game.targets = [];
    game.targets.push(targetPile);

    let lowest = game.highestTargetPilesFilled();

    expect(lowest).toBe(1);

});

    
test('areTargetPilesFilled piles are filled', () => {

    let pile1 = {};
    pile1.getSize = () => 1;

    let pile2 = {};
    pile2.getSize = () => 1;
    
    let pile3 = {};
    pile3.getSize = () => 1;
    
    let pile4 = {};
    pile4.getSize = () => 1;    

    game.targets = [];

    game.targets.push(pile1);
    game.targets.push(pile2);
    game.targets.push(pile3);
    game.targets.push(pile4);

    let result = game.areTargetPilesFilled();

    expect(result).toBe(true);

});

test('areTargetPilesFilled piles are not filled', () => {

    let pile1 = {};
    pile1.getSize = () => 1;

    let pile2 = {};
    pile2.getSize = () => 1;
    
    let pile3 = {};
    pile3.getSize = () => 1;
    
    let pile4 = {};
    pile4.getSize = () => 0;    

    game.targets = [];

    game.targets.push(pile1);
    game.targets.push(pile2);
    game.targets.push(pile3);
    game.targets.push(pile4);

    let result = game.areTargetPilesFilled();

    expect(result).toBe(false);

});

test('getPile return pile', () => {

    let pile = {};
    pile.name = 'pile1';

    game.piles = [];

    game.piles.push(pile);

    let target = {};
    target.name = 'target1';

    game.targets = [];

    game.targets.push(target);

    game.cardpile = {};
    game.cardpile.name = 'cardpile';

    game.showpile = {};
    game.showpile.name = 'showpile';

    let returnPile = game.getPile('pile1');

    expect(returnPile).toBe(pile);


});

test('getPile return target', () => {

    let pile = {};
    pile.name = 'pile1';

    game.piles = [];

    game.piles.push(pile);

    let target = {};
    target.name = 'target1';

    game.targets = [];

    game.targets.push(target);

    game.cardpile = {};
    game.cardpile.name = 'cardpile';

    game.showpile = {};
    game.showpile.name = 'showpile';

    let returnPile = game.getPile('target1');

    expect(returnPile).toBe(target);


});

test('getPile return cardpile', () => {

    let pile = {};
    pile.name = 'pile1';

    game.piles = [];

    game.piles.push(pile);

    let target = {};
    target.name = 'target1';

    game.targets = [];

    game.targets.push(target);

    game.cardpile = {};
    game.cardpile.name = 'cardpile';

    game.showpile = {};
    game.showpile.name = 'showpile';

    let returnPile = game.getPile('cardpile');

    expect(returnPile).toBe(game.cardpile);


});

test('getPile return showpile', () => {

    let pile = {};
    pile.name = 'pile1';

    game.piles = [];

    game.piles.push(pile);

    let target = {};
    target.name = 'target1';

    game.targets = [];

    game.targets.push(target);

    game.cardpile = {};
    game.cardpile.name = 'cardpile';

    game.showpile = {};
    game.showpile.name = 'showpile';

    let returnPile = game.getPile('showpile');

    expect(returnPile).toBe(game.showpile);


});

test('moveNextValue showpile to targetpile', () => {

    let showCard = {};
    showCard.value = 13;
    showCard.suit = 'diamond';

    let targetCard = {};
    targetCard.value = 12;
    targetCard.suit = 'diamond';

    game.showpile = {};
    game.showpile.getTopCard = () => showCard;
    game.showpile.removeLastCard = () => showCard;

    game.targets = [];
    let targetPile = {};
    targetPile.getTopCard = () => targetCard;
    targetPile.addCard = () => {};
    game.targets.push(targetPile);

    game.piles = [];
    
    game.checkForWinner = () => {};

    var spyGetTopCardShowPile = jest.spyOn(game.showpile, 'getTopCard');
    var spyGetTopCardTargetPile = jest.spyOn(targetPile, 'getTopCard');
    var spyRemoveLastCard = jest.spyOn(game.showpile, 'removeLastCard');
    var spyAddCard = jest.spyOn(targetPile, 'addCard');
    var spyCheckForWinner = jest.spyOn(game,'checkForWinner');

    game.moveNextValue(13);

    expect(spyGetTopCardShowPile).toHaveBeenCalledTimes(1);
    expect(spyGetTopCardTargetPile).toHaveBeenCalledTimes(1);
    expect(spyRemoveLastCard).toHaveBeenCalledTimes(1);
    expect(spyAddCard).toHaveBeenCalledTimes(1);
    expect(spyCheckForWinner).toHaveBeenCalledTimes(1);

});

test('moveNextValue pile to targetpile', () => {

    let showCard = undefined;

    let pileCard = {};
    pileCard.value = 13;
    pileCard.suit = 'diamond';
    pileCard.isFaceDown = () => false;

    let targetCard = {};
    targetCard.value = 12;
    targetCard.suit = 'diamond';

    game.showpile = {};
    game.showpile.getTopCard = () => showCard;
    game.showpile.removeLastCard = () => showCard;

    game.targets = [];
    let targetPile = {};
    targetPile.getTopCard = () => targetCard;
    targetPile.addCard = () => {};
    game.targets.push(targetPile);

    game.piles = [];
    let pile = {};
    pile.getTopCard = () => pileCard;
    pile.addCard = () => {};
    pile.removeLastCard = () => pileCard;
    game.piles.push(pile);
    
    game.checkForWinner = () => {};

    var spyGetTopCardShowPile = jest.spyOn(game.showpile, 'getTopCard');
    var spyGetTopCardTargetPile = jest.spyOn(pile, 'getTopCard');
    var spyRemoveLastCard = jest.spyOn(pile, 'removeLastCard');
    var spyAddCard = jest.spyOn(targetPile, 'addCard');
    var spyCheckForWinner = jest.spyOn(game,'checkForWinner');

    game.moveNextValue(13);

    expect(spyGetTopCardShowPile).toHaveBeenCalledTimes(1);
    expect(spyGetTopCardTargetPile).toHaveBeenCalledTimes(1);
    expect(spyRemoveLastCard).toHaveBeenCalledTimes(1);
    expect(spyAddCard).toHaveBeenCalledTimes(1);
    expect(spyCheckForWinner).toHaveBeenCalledTimes(1);

});

test('checkForWinner', () => {

    game.pilesCompleted = 3;
    game.modal = {};
    game.modal.openDialog = () => {};

    let spyOpenDialog = jest.spyOn(game.modal, 'openDialog');

    game.checkForWinner();

    expect(spyOpenDialog).toHaveBeenCalledTimes(1);
});