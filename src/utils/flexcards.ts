interface FlexCardsComponents {
    container: HTMLDivElement;
    content: HTMLDivElement;
}

export interface FlexCardsOptions {
    components: "default" | "images";
}

class FlexCards<Components = Record<string, HTMLElement>> {
    public container: HTMLDivElement;
    public components: FlexCardsComponents & Components;

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

        // set components
        this.components = {
            container: this.container,
            content: document.createElement('div'),
        } as typeof this.components;
    }

    protected setClass(element: HTMLElement, ...classes: string[]) {
        element.classList.add(...classes.map(c => 'flexcards__'.concat(c)));
        return element;
    }

    protected createWithAttributes<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        attributes?: Record<string, any> & { children?: HTMLElement },
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName);

        attributes && Object.keys(attributes).forEach(e => {
            if (e === 'children') { // @ts-ignore
                element.appendChild(attributes[e]);
            } else { // @ts-ignore
                element[e] = attributes[e];
            }
        });

        return element;
    }

    protected initContainer() {
        const { setClass } = this;

        // first add styles
        document.head.appendChild(this.createWithAttributes('link', {
            href: "/build/style.css",
            type: "text/css",
            rel: "stylesheet",
        }));

        // set containers
        setClass(this.container, 'wrapper');

        const container = setClass(document.createElement('div'), 'container');
        const content = setClass(document.createElement('div'), 'content');

        // mount components
        this.container.textContent = "";
        this.container.appendChild(container);
        container.appendChild(content);

        // add slides in the content box
        this.slides.forEach((slide, key) => {
            const slideContainer = this.createWithAttributes('div', {
                children: setClass(slide, 'card'),
            });
            content.appendChild(setClass(slideContainer, 'card-container'));

            slide.setAttribute('data-id', key.toString());

            setClass(slide, 'card');
            slide instanceof HTMLImageElement && setClass(slide, 'image');
        });

        // then add components in the components attr
        this.components = { container, content } as typeof this.components;
    }

    public start() {}
}

export default FlexCards;
