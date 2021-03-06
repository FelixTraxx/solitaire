
class Modal {

    constructor() {
        this.element = document.getElementById("modal");
        this.element.style.zIndex = 1000;
        this.closeButton = document.getElementById("modal-close");
        this.closeButton.addEventListener("click", this);
    }

    handleEvent(event) {

        this.element.style.display = "none";

    }

    openDialog() {
        this.element.style.display = "block";
    }
}

export {Modal};