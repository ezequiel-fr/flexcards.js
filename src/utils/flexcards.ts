declare interface FlexCardsOptions {
    components: "default" | "images";
};

class FlexCards {
    public container: HTMLDivElement;

    public length: number;
    public slides: (HTMLElement | HTMLImageElement)[];

    constructor(element: string, options: FlexCardsOptions = { components: 'default' }) {
        // set container
        try {
            let elementExists = document.querySelector(element) as HTMLElement;

            if (!elementExists) {
                throw "The provided selector is invalid or element does not exist.";
            } else if (!(elementExists instanceof HTMLDivElement)) {
                throw "Container element must be a <div>.";
            }

            this.container = elementExists;
        } catch (err) {
            console.warn(err);
            this.container = document.createElement('div');
        }

        // set slides
        this.slides = Array.from(this.container.querySelectorAll(
            options.components === "default" ? "article" : "img"
        ));
        this.length = this.slides.length;
    }

    protected initWithStyles(...styles: string[]) {
        // 
    }
}

export default FlexCards;
