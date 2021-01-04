const index = require('../card.js');

test('Card Constructor', () => {
    let card = new index.Card('images/test.png', 'aceofspades', 'spades', 1);
    expect(card.isFaceDown()).toBe(true);
    expect(card.suit).toBe('spades');
    expect(card.value).toBe(1);
    expect(card.color).toBe('black');
    expect(card.frontImage).toBe('images/test.png');
    expect(card.backImage).toBe('images/cardback.png');
});