import { Card } from './card.js'

class Pile {


    constructor(id, type) {
        this.element = document.getElementById(id);
        this.element.height = 87;
        this.element.width = 62;
        this.element.style.position = "relative";
        this.stack = [];
        this.element.addEventListener("drop", this);
        this.element.addEventListener("dragover", this);
        this.element.addEventListener("cardclick", this);
        this.element.addEventListener("carddragstart", this);
        this.name = id;
        this.type = type;
    }

    handleClick(event) {

    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleCardClick(event) {

        var payload = event.detail;
        payload.pileId = this.name;
        payload.pileType = this.type;

        const customEvent = new CustomEvent('cardclickwithpile', {detail: payload, bubbles: true});

        this.element.dispatchEvent(customEvent);

    }

    handleCardDragStart(event) {
        var payload = event.detail;
        payload.pileId = this.name;
        payload.pileType = this.type;
        payload.pileName = this.name;

        var cardList = this.getAllDroppedCards(payload.card);
        payload.cards = cardList;

        const customEvent = new CustomEvent('carddragstartwithpile', {detail: payload, bubbles: true});

        this.element.dispatchEvent(customEvent);        
    }

    getAllDroppedCards(card) {
        var cardList = [];

        var addRest = false;
        for(var i = 0; i < this.stack.length; i++) {
            if(card === this.stack[i]) {
                addRest = true;
            }
            if(addRest === true) {
                cardList.push(this.stack[i]);
            }
        }
        return cardList;
    }

    handleDrop(event) {

        event.preventDefault();

        var payload = {};
        payload.pileId = this.name;
        payload.pileType = this.type;
        payload.pileName = this.name;

        const customEvent = new CustomEvent('carddropwithpile', {detail: payload, bubbles: true});

        this.element.dispatchEvent(customEvent);          
    }

    handleEvent(event) {

        if(event.type == "drop") {
            this.handleDrop(event);
        }

        if(event.type == "dragover") {
            this.handleDragOver(event);
        }

        if(event.type == "cardclick") {
            this.handleCardClick(event);
        }

        if(event.type === "carddragstart") {
            this.handleCardDragStart(event);
        }

    }

    addCard(card) {
        this.stack.push(card);
        card.setZIndex(this.stack.length);
        card.setTop(13);
        this.element.appendChild(card.getElement());
    }

    addCardNextLevel(card) {
        var topCard = this.getTopCard();
        var top = topCard.element.style.top;
        top = parseInt(top,10)
        this.stack.push(card);
        card.setZIndex(this.stack.length);
        card.setTop(top + 23);
        this.element.appendChild(card.getElement());   
    }

    removeLastCard() {
        var lastCard = this.stack.pop();
        this.element.removeChild(lastCard.getElement());
        return lastCard;
    }

    getTopCard() {
        var lastIndex = this.stack.length - 1;
        
        if(lastIndex >= 0) {
            return this.stack[lastIndex];
        }
        else {
            return undefined;
        }
    }

    getSize() {
        return this.stack.length;
    }

}

export {Pile};