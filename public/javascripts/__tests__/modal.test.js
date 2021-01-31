const { ExpectationFailed } = require('http-errors');
const { TestScheduler } = require('jest');
const index = require('../modal.js');

let modal = undefined;

beforeEach(() => {

    document.body.innerHTML = 
    '<div id="modal"><div id="modal-close"></div></div>'

    modal = new index.Modal();

});

test('constructor',() => {

    expect(modal.element).not.toBe(undefined);
    expect(modal.element.style.zIndex).toBe("1000");
    expect(modal.closeButton).not.toBe(undefined);

});

test('handleEvent', () => {

    let event = {};

    modal.handleEvent(event);

    expect(modal.element.style.display).toBe("none");
});

test('openDialog', () => {

    modal.openDialog();

    expect(modal.element.style.display).toBe("block");

});