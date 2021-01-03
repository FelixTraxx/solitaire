

class Button {

    constructor(id) {
        this.element = document.getElementById(id);
        this.element.addEventListener("click", this);
        this.name = id;
    }

    handleClick(event) {
        var payload = {
            button: this
        }

        const customEvent = new CustomEvent('buttonclick', {detail: payload, bubbles: true});

        this.element.dispatchEvent(customEvent); 
    }

    handleEvent(event) {
        this.handleClick(event);
    }
}

export {Button};