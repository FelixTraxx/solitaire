const index = require('../public/javascripts/index.js');


test('Random number between 1 and 10', () => {
    expect(window.getRandomIntInclusive(1,10)).toBeLessThanOrEqual(10);
});