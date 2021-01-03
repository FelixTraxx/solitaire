 
import { Pile } from './pile.js';
 
 class Card {

    constructor(frontImage, idString, suit, value) {
        this.element = document.createElement("img");
        this.element.src = "images/cardback.png";
        this.backImage = "images/cardback.png";
        this.frontImage = frontImage;
        this.faceDown = true;
        this.suit = suit;
        this.value = value;
        if(suit === "diamonds" || suit === "hearts") {
            this.color = "red";
        }
        if(suit === "clubs" || suit === "spades") {
            this.color = "black";
        }
        this.element.height = 87;
        this.element.width = 62;
        this.element.draggable = true;
        this.element.id = idString;
        this.element.card = this;
        this.element.style.position = "absolute";
        this.element.style.top = 13;
        this.element.style.left = 13;
        this.element.addEventListener("click", this);
        this.element.addEventListener("dragstart", this);

    }

    isFaceDown() {
        return this.faceDown;
    }

    flipCard() {
        if(this.faceDown) {
            this.faceDown = false;
            this.element.src = this.frontImage;
        }
        else {
            this.faceDown = true;
            this.element.src = this.backImage;
        }
    }

    handleClick() {

        var payload = {
            card: this
        }

        const customEvent = new CustomEvent('cardclick', {detail: payload, bubbles: true});

        this.element.dispatchEvent(customEvent);
    }

    handleDragStart(event) {

        var payload = {
            card: this
        }

        const customEvent = new CustomEvent('carddragstart', {detail: payload, bubbles: true});

        this.element.dispatchEvent(customEvent);        
    }

    handleEvent(event) {

        if(event.type == "click") {
            this.handleClick();
        }

        if(event.type == "dragstart") {
            this.handleDragStart(event);
        }

    }

    setTop(top) {
        this.element.style.top = top;
    }

    setZIndex(index) {
        this.element.style.zIndex = index;
    }

    getElement() {
        return this.element;
    }

 }

 export {Card};