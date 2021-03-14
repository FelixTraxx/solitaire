import { Card } from './card.js'
import { Pile } from './pile.js';
import { Button } from './button.js';
import { Modal } from './modal.js';

class Game {

    constructor() {
        this.element = document.getElementById("gameboard");
        this.element.addEventListener("cardclickwithpile", this);
        this.element.addEventListener("carddragstartwithpile", this);
        this.element.addEventListener("carddropwithpile", this);
        this.element.addEventListener("buttonclick", this);
        this.cardpile;
        this.showpile;
        this.resetButton = new Button("resetGame");
        this.piles = [];
        this.targets = [];
        this.cards = [];
        this.dragData = {};
        this.pilesCompleted = 0;
        this.cardValueCompleted = 0;
        this.setupGame();
        this.modal = new Modal();
    }

    clickCardInCardPile(payload) {
        var card = this.cardpile.removeLastCard();
        card.flipCard();
        this.showpile.addCard(card);
    }

    clickCardInShowPile(payload) {

        var cardPileSize = this.cardpile.getSize();
        var showPileSize = this.showpile.getSize();
        if(cardPileSize == 0) {
            for(var i = 0; i < showPileSize; i++) {
                var card = this.showpile.removeLastCard();
                card.flipCard();
                this.cardpile.addCard(card);
            }
        }

    }  

    highestTargetPilesFilled() {
        var lowest = 0;

        if(this.areTargetPilesFilled() === false) {
            return 0;
        }

        lowest = this.targets[0].getTopCard().value;

        for(var i = 0; i < this.targets.length; i++) {
            if(this.targets[i].getSize() > 0) {
                var currentValue = this.targets[i].getTopCard().value;
                if(currentValue < lowest) {
                    lowest = currentValue;
                }
            }
        }
        return lowest;
    }
    
    areTargetPilesFilled() {
        var numFilled = 0;
        for(var i = 0; i < this.targets.length; i++) {
            if(this.targets[i].getSize() > 0) {
                numFilled++;
            }
        }
        if(numFilled === 4) {
            return true;
        }
        else {
            return false;
        }
    }

    getPileIndexById(id) {
        for(var i = 0; i < this.piles.length; i++) {
            if(this.piles[i].name === id) {
                return i;
            }
        }
    }
    
    clickCardInPilePile(payload) {
        var card = payload.card;
        var pileIndex = this.getPileIndexById(payload.pileId);
        var pileSize = this.piles[pileIndex].getSize();
        if(card.isFaceDown()) {
            if(pileSize > 1) {
                this.piles[pileIndex].moveToNextLevel(card);
            }
            card.flipCard();
        }
    }

    handleCardClickWithPile(event) {
        var payload = event.detail;

        if(payload.pileType === "card") {
            this.clickCardInCardPile(payload);
        }
        
        if(payload.pileType === "pile") {
            this.clickCardInPilePile(payload);
        }

        if(payload.pileType === "show") {
            this.clickCardInShowPile(payload);
        }        
    }

    handleCardDragStartWithPile(event) {
        var payload = event.detail;

        this.dragData = payload;
    }

    getPile(id) {

        var returnPile = undefined;

        for(var i = 0; i < this.piles.length; i++) {
            if(this.piles[i].name == id) {
                returnPile =  this.piles[i];
            }
        }

        for(var i = 0; i < this.targets.length; i++) {
            if(this.targets[i].name == id) {
                returnPile =  this.targets[i];
            }
        }        

        if(this.cardpile.name === id) {
            returnPile = this.cardpile;
        }

        if(this.showpile.name === id) {
            returnPile = this.showpile;
        }


        return returnPile;
    }

    moveNextValue(newValue) {
        var cardsMoved = 0;

        for(var j = 0; j < this.piles.length; j++) {
            var pileTopCard = this.piles[j].getTopCard();
            if(pileTopCard !== undefined && 
                pileTopCard !== null && 
                pileTopCard.value === newValue &&
                pileTopCard.isFaceDown() === false) {
                for(var i = 0; i < this.targets.length; i++) {
                    var currentValue = this.targets[i].getTopCard().value;
                    var currentSuit = this.targets[i].getTopCard().suit;
                    if(pileTopCard.suit === currentSuit) {
                        this.piles[j].removeLastCard();
                        this.targets[i].addCard(pileTopCard);
                        cardsMoved++;
                        if(pileTopCard.value === 13) {
                            this.checkForWinner();
                        }
                    }
                }
            }
        }

        return cardsMoved;
    }

    checkForWinner() {
        this.pilesCompleted += 1;
        if(this.pilesCompleted === 4) {
            this.modal.openDialog();                        
        }
    }

    handleCardDropWithPile(event) {
        var payload = event.detail;
        var dropCard = this.dragData.card;
        var dropCards = this.dragData.cards;

        var fromPileName = this.dragData.pileName;  
        var toPileName = payload.pileName;
        var fromPile = this.getPile(fromPileName);
        var toPile = this.getPile(toPileName);  
        var cardsMoved = 0;
             
        // Prevent Drag and Drop to and from certain piles
        if(fromPile.type === "pile" && toPile.type === "card") {
            return;
        }

        if(fromPile.type === "pile" && toPile.type === "show") {
            return;
        }

        if(fromPile.type === "target") {
            return;
        }

        // Follow rules in pile to target drag and drops
        if((fromPile.type === "pile" || fromPile.type === "show") && toPile.type === "target") {
            var lastCard = toPile.getTopCard();
            if(lastCard === undefined) {
                if(dropCard.value === 1) {
                    var fromCard = fromPile.removeLastCard();
                    toPile.addCard(fromCard);  
                    cardsMoved++;                      
                    var targetValue = this.highestTargetPilesFilled();
                    if(targetValue > 0 && fromPile.type === "pile") {
                        var nextValue = targetValue + 1;
                        var cardsMovedFromNext = this.moveNextValue(nextValue);
                        cardsMoved += cardsMovedFromNext;
                        if(cardsMoved === 4) {
                            nextValue++;
                        }
                        while(cardsMoved === 4 && nextValue <= 13) {
                            cardsMoved = this.moveNextValue(nextValue);
                            nextValue++;
                        }
                    }
                }
                return;
            }  
            else if(dropCards.length > 1) {
                return;
            }  
            else if(lastCard.suit === dropCard.suit && lastCard.value === dropCard.value - 1) {
                var fromCard = fromPile.removeLastCard();
                toPile.addCard(fromCard);
                cardsMoved++;
                if(dropCard.value === 13) {
                    this.checkForWinner();
                }
                var targetValue = this.highestTargetPilesFilled();
                var nextValue = targetValue + 1;
                if(targetValue > 0 && nextValue <= 13 && fromPile.type === "pile") {
                    var nextValue = targetValue + 1;
                    var cardsMovedFromNext = this.moveNextValue(nextValue);
                    cardsMoved += cardsMovedFromNext;
                    if(cardsMoved === 4) {
                        nextValue++;
                    }
                    while(cardsMoved === 4 && nextValue <= 13) {
                        cardsMoved = this.moveNextValue(nextValue);
                        nextValue++;
                    }
                }
                return;
            }
            return;       
        }

        // Follow rules in pile to pile drag and drops
        if((fromPile.type === "pile" || fromPile.type === "show") && toPile.type === "pile") {
            var lastCard = toPile.getTopCard();
            if(lastCard === undefined) {
                if(dropCard.value === 13) {
                    for(var i = 0; i < dropCards.length; i++) {
                        var fromCard = fromPile.removeLastCard();
                    }
                    for(var i = 0; i < dropCards.length; i++) {
                        if(i === 0) {
                            toPile.addCard(dropCards[i]);
                        }
                        else {
                            toPile.addCardNextLevel(dropCards[i]);
                        }
                    }
                }
                return;
            }
            else if(lastCard.color === "red" && dropCard.color === "black" && lastCard.value === dropCard.value + 1){
                for(var i = 0; i < dropCards.length; i++) {
                    var fromCard = fromPile.removeLastCard();
                }
                for(var i = 0; i < dropCards.length; i++) {
                    toPile.addCardNextLevel(dropCards[i]);
                }
                return;
            }
            else if(lastCard.color === "black" && dropCard.color === "red" && lastCard.value === dropCard.value + 1){
                for(var i = 0; i < dropCards.length; i++) {
                    var fromCard = fromPile.removeLastCard();
                }
                for(var i = 0; i < dropCards.length; i++) {
                    toPile.addCardNextLevel(dropCards[i]);
                }
                return;
            } 
            else { 
                return;
            }           
        }


    }

    handleButtonClick(event) {

        this.resetGame();
    }

    handleEvent(event) {

        if(event.type == "cardclickwithpile") {
            this.handleCardClickWithPile(event);
        }

        if(event.type === "carddragstartwithpile") {
            this.handleCardDragStartWithPile(event);
        }

        if(event.type === "carddropwithpile") {
            this.handleCardDropWithPile(event);
        }

        if(event.type === "buttonclick") {
            this.handleButtonClick(event);
        }

    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    resetGame() {
        this.pilesCompleted = 0;
        // Remove the cards from the piles.
        for(var pileIndex = 0; pileIndex < this.piles.length; pileIndex++) {
            var length = this.piles[pileIndex].getSize();
            for(var cardIndex = 0; cardIndex < length; cardIndex++) {
                var card = this.piles[pileIndex].removeLastCard();
            }
        }
        // Remove the cards from the target piles.
        for(var pileIndex = 0; pileIndex < this.targets.length; pileIndex++) {
            var length = this.targets[pileIndex].getSize();
            for(var cardIndex = 0; cardIndex < length; cardIndex++) {
                var card = this.targets[pileIndex].removeLastCard();
            }
        } 
        // Remove cards from the show pile
        var length = this.showpile.getSize();
        for(var cardIndex = 0; cardIndex < length; cardIndex++) {
            var card = this.showpile.removeLastCard();
        }    
        // Remove cards from the card pile
        length = this.cardpile.getSize();
        for(var cardIndex = 0; cardIndex < length; cardIndex++) {
            var card = this.cardpile.removeLastCard();
        } 
        // Shuffle the deck
        for(var i = 0; i < 52; i++) {
            var num1 = this.getRandomIntInclusive(0,51);
            var num2 = this.getRandomIntInclusive(0,51);
            var temp = this.cards[num1];
            this.cards[num1] = this.cards[num2];
            this.cards[num2] = temp;
        } 
        // Distribute the cards to the card pile.
        for(var i = 0; i < 52; i++) {
            if(this.cards[i].isFaceDown() === false) {
                this.cards[i].flipCard();
            }
            this.cardpile.addCard(this.cards[i]);
        } 
        // Distribute the cards to the other piles.
        for(var pileIndex = 0; pileIndex < this.piles.length; pileIndex++) {
            var numCards = pileIndex + 1;
            var card;
            for(var cardIndex = 0; cardIndex < numCards; cardIndex++) {
                var card = this.cardpile.removeLastCard();
                this.piles[pileIndex].addCard(card);
            }
            if(pileIndex > 0) {
                this.piles[pileIndex].moveToNextLevel(card);
            }
            card.flipCard();
        }                               
    }

    setupGame() {
        this.cardpile = new Pile("cardpile", "card");
        this.showpile = new Pile("showpile", "show");
        var suit;
        for(var j = 1; j <= 4; j++) {
            if(j == 1) {
                suit = "diamonds";
            }
            else if(j == 2) {
                suit = "hearts";
            }
            else if(j == 3) {
                suit = "clubs";
            }
            else if(j == 4) {
                suit = "spades";
            }
            for(var i = 1; i <= 13; i++) {
                var card = new Card("images/" + i + "_of_" + suit + ".png", suit + i, suit, i);
                this.cards.push(card);
            }
        }
        // Shuffle the deck
        for(var i = 0; i < 52; i++) {
            var num1 = this.getRandomIntInclusive(0,51);
            var num2 = this.getRandomIntInclusive(0,51);
            var temp = this.cards[num1];
            this.cards[num1] = this.cards[num2];
            this.cards[num2] = temp;
        }
        // Create Piles
        for(var i = 1; i <= 7; i++) {
            this.piles.push(new Pile("pile" + i, "pile"));
        }   
        // Create Targets
        for(var i = 1; i <= 4; i++) {
            this.targets.push(new Pile("target" + i, "target"));
        }          
        // Distribute the cards to the card pile.
        for(var i = 0; i < 52; i++) {
            this.cardpile.addCard(this.cards[i]);
        }
        // Distribute the cards to the other piles.
        for(var pileIndex = 0; pileIndex < 7; pileIndex++) {
            var numCards = pileIndex + 1;
            var card;
            for(var cardIndex = 0; cardIndex < numCards; cardIndex++) {
                var card = this.cardpile.removeLastCard();
                this.piles[pileIndex].addCard(card);
            }
            if(pileIndex > 0) {
                this.piles[pileIndex].moveToNextLevel(card);
            }
            card.flipCard();
        }
    }
}

export {Game};