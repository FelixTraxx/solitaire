const index = require('../index.js');


test('Random number between 1 and 10', () => {
    expect(getRandomIntInclusive(1,10)).toBeLessThanOrEqual(10);
});

