const { TestScheduler } = require('jest');
const index = require('../pile.js');
let pile = undefined;
let event = undefined;
let card = undefined;

beforeEach(() => {

    document.body.innerHTML = 
    '<div><div id="pile1"></div></div>';

    pile = new index.Pile('pile1','pile');

    event = {
        type: "dragover",
        preventDefault: function() {

        }
    }

    card = {
        element: {
            src: '',
            style: {
                zIndex: -1
            }
        },
        setZIndex: function() {

        },
        setTop: function() {

        },
        getElement: function() {

        }
    }    

});

test('Pile Constructor', () => {

    expect(pile.element).not.toBeNull();
    expect(pile.element.height).toBe(87);
    expect(pile.element.width).toBe(62);
    expect(pile.element.style.position).toBe('relative');
    expect(pile.stack).toHaveLength(0);
    expect(pile.name).toBe('pile1');
    expect(pile.type).toBe('pile'); 

});

test('handleDragOver', () => { 

    const spyHandleDragOver = jest.spyOn(pile, 'handleDragOver');
    const spyPreventDefault = jest.spyOn(event, 'preventDefault');

    pile.handleEvent(event);

    expect(spyHandleDragOver).toBeCalled();
    expect(spyPreventDefault).toBeCalled();
});

test('handleDrop', () => { 

    event.type = 'drop';

    const spyHandleDrop = jest.spyOn(pile, 'handleDrop');
    const spyPreventDefault = jest.spyOn(event, 'preventDefault');

    pile.handleEvent(event);

    expect(spyHandleDrop).toBeCalled(); 
    expect(spyPreventDefault).toBeCalled();

});

test('handleCardClick', () => { 

    event.type = 'cardclick';
    event.detail = {
        pileId: undefined
    }

    const spyHandleCardClick = jest.spyOn(pile, 'handleCardClick');
    const spyPreventDefault = jest.spyOn(event, 'preventDefault');

    pile.handleEvent(event);

    expect(spyHandleCardClick).toBeCalled();
    expect(spyPreventDefault).not.toBeCalled();

});

test('handleCardDragStart', () => { 

    event.type = 'carddragstart';
    event.detail = {
        pileId: undefined
    }

    const spyHandleCardDragStart = jest.spyOn(pile, 'handleCardDragStart');
    const spyPreventDefault = jest.spyOn(event, 'preventDefault');

    pile.handleEvent(event);

    expect(spyHandleCardDragStart).toBeCalled();
    expect(spyPreventDefault).not.toBeCalled();

});

test('addCard', () => { 

    pile.element = {
        appendChild: function() {

        }
    }

    const spySetZIndex = jest.spyOn(card, 'setZIndex');
    const spySetTop = jest.spyOn(card, 'setTop');
    const spyGetElement = jest.spyOn(card, 'getElement');

    pile.addCard(card);

    expect(pile.stack).toHaveLength(1);
    expect(spySetZIndex).toBeCalledWith(1);
    expect(spySetTop).toBeCalledWith(13);
    expect(spyGetElement).toBeCalled();

});

test('addCardNextLevel', () => { 

    let topCard = {};
    topCard.element = {};
    topCard.element.style = {};
    topCard.element.style.top = '0px';

    pile.element = {
        appendChild: function() {

        }
    }

    pile.getTopCard = function() {
        return topCard;
    }

    const spySetZIndex = jest.spyOn(card, 'setZIndex');
    const spySetTop = jest.spyOn(card, 'setTop');
    const spyGetElement = jest.spyOn(card, 'getElement');

    pile.addCardNextLevel(card);

    expect(pile.stack).toHaveLength(1);
    expect(spySetZIndex).toBeCalledWith(1);
    expect(spySetTop).toBeCalledWith(23);
    expect(spyGetElement).toBeCalled();

});

test('removeLastCard', () => { 

    let topCard = {};
    topCard.element = {};
    topCard.element.style = {};
    topCard.element.style.top = '0px';
    topCard.getElement = function() {
        
    }

    pile.stack = [];
    pile.stack.push(topCard);

    pile.element = {
        removeChild: function() {

        }
    }

    pile.getTopCard = function() {
        return topCard;
    }

    const spyRemoveChild = jest.spyOn(pile.element, 'removeChild');
    const spyGetElement = jest.spyOn(topCard, 'getElement');

    let removedCard = pile.removeLastCard();

    expect(pile.stack).toHaveLength(0);
    expect(spyRemoveChild).toBeCalled();
    expect(spyGetElement).toBeCalled();
    expect(removedCard).toBe(topCard);

});

test('getTopCard Not Empty', () => { 

    let topCard = {};

    pile.stack = [];
    pile.stack.push(topCard);

    let removedCard = pile.getTopCard();

    expect(removedCard).toBe(topCard);

});

test('getTopCard Not Empty', () => { 

    pile.stack = [];

    let removedCard = pile.getTopCard();

    expect(removedCard).toBe(undefined);

});

test('getSize', () => { 

    pile.stack = [];

    let size = pile.getSize();

    expect(size).toBe(0);

});

test('getAllDroppedCards', () => { 

    pile.stack = [];
    pile.stack.push(card);

    let cardList = pile.getAllDroppedCards(card);

    expect(cardList.length).toBe(1);

});

test('getAllDroppedCards No Cards', () => { 

    pile.stack = [];

    let cardList = pile.getAllDroppedCards(card);

    expect(cardList.length).toBe(0);

});