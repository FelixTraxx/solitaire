const { ExpectationFailed } = require('http-errors');
const { TestScheduler } = require('jest');
const index = require('../button.js');

let button = undefined;

beforeEach(() => {

    document.body.innerHTML = 
    '<div id="buttonid"></div>'

    button = new index.Button("buttonid");

});

test('constructor',() => {

    expect(button.element).not.toBe(undefined);
    expect(button.name).toBe("buttonid");
    
});

test('handleEvent', () => {

    let event = {};

    button.element.dispatchEvent = () => {

    }

    let spyDispatchEvent = jest.spyOn(button.element,'dispatchEvent');

    button.handleEvent(event);

    expect(spyDispatchEvent).toHaveBeenCalledTimes(1);

});