const index = require('../card.js');
const $ = require('jquery');

test('Card Constructor', () => {

    document.body.innerHTML = 
        '<div></div>';

    let card = new index.Card('images/test.png', 'aceofspades', 'spades', 1);
    expect(card.isFaceDown()).toBe(true);
    expect(card.suit).toBe('spades');
    expect(card.value).toBe(1);
    expect(card.color).toBe('black');
    expect(card.frontImage).toBe('images/test.png');
    expect(card.backImage).toBe('images/cardback.png');

    const spyHandleClick = jest.spyOn(card, 'handleClick');

    const spyhandleDragStart = jest.spyOn(card, 'handleDragStart');

    const event = {
        type: "click"
    }

    card.handleEvent(event);

    expect(spyHandleClick).toBeCalled();

    const event2 = {
        type: "dragstart"
    }

    card.handleEvent(event2);

    expect(spyhandleDragStart).toBeCalled();

    const spySetTop = jest.spyOn(card, 'setTop');

    card.setTop(13);

    expect(spySetTop).toBeCalled();

    const spyZIndex = jest.spyOn(card, 'setZIndex');

    card.setZIndex(1000);

    expect(spyZIndex).toBeCalled();

    card.flipCard();

    expect(card.isFaceDown()).toBe(false);

    card.flipCard();

    expect(card.isFaceDown()).toBe(true);
    
});