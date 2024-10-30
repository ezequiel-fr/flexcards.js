// @ts-nocheck // Ignore TypeScript errors (generated by the EventEmitter class)
import EventEmitter from 'events';

interface FlexCardsComponents {
    /** The container element. */
    container: HTMLDivElement;
    /** The content element. */
    content: HTMLDivElement;
}

export interface FlexCardsOptions {
    /** The container element. */
    components: "default" | "images";
    /** Hex color code for the theme. */
    theme?: string;
}

type Children = { children?: HTMLElement };

/** FlexCards events */
interface FlexCardsEvents {
    ready: () => void;
}

/** FlexCards class */
abstract class FlexCards<Components = Record<string, HTMLElement>, Events = FlexCardsEvents> extends EventEmitter {
    /** The container element. */
    public container: HTMLDivElement;
    /** The components of the FlexCards instance. */
    public components: FlexCardsComponents & Components;

    /** The slides (childs) of the FlexCards instance. */
    public slides: (HTMLElement | HTMLImageElement)[];
    /** The theme of the FlexCards instance. */
    public theme: string;

    /** The current state of the FlexCards instance. */
    public currentState = FlexCards.PENDING;

    // constants
    /** Pending state of an instance. */
    public static readonly PENDING = 0;
    /** Ready state of an instance. */
    public static readonly READY = 1;

    /**
     * Create a new FlexCards instance.
     * 
     * @param element The element to initialize the component with.
     * @param options The options to initialize the component with.
     */
    constructor(element: string, options: FlexCardsOptions = { components: "default" }) {
        // Initialize the EventEmitter class
        super();

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

        // set components
        this.components = {
            container: this.container,
            content: document.createElement('div'),
        } as typeof this.components;

        // Set slides
        const slides = Array.from(this.container.children) as typeof this.slides;

        this.slides = slides.filter(slide =>
            slide.tagName === (options.components === "images" ? 'IMG' : 'ARTICLE')
        );

        // Set theme
        this.theme = options.theme ?? "#000";

        this.theme = this.theme.replace('#', '');
        this.theme = this.theme.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r+r+g+g+b+b);

        // set basic event listeners
        this.on('ready', () => {
            this.currentState = FlexCards.READY;
        });
    }

    /**
     * Set classes to an element.
     * 
     * @param element The element to set classes to.
     * @param classes The classes to set.
     * @returns The element with the classes set.
     */
    protected setClass<T extends HTMLElement>(element: T, ...classes: string[]) {
        element.classList.add(...classes.filter(e => e.length).map(c => 'flexcards__'.concat(c)));
        return element;
    }

    /**
     * Create an element with attributes.
     * 
     * @param tagName The tag name of the element.
     * @param attributes The attributes to add to the element.
     * @returns The created element.
     */
    protected createWithAttributes<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        attributes?: Omit<Partial<HTMLElementTagNameMap[K]>, 'children'> & Children,
    ) {
        const element = document.createElement(tagName);

        attributes && Object.keys(attributes).forEach(e => {
            if (e === 'children') {
                element.appendChild(attributes[e]!);
            } else {
                // @ts-ignore
                element[e] = attributes[e];
            }
        });

        return element;
    }

    /**
     * Initialize the FlexCards component.
     * 
     * @param options The options to initialize the component with.
     * @returns The FlexCards instance.
     */
    protected initContainer() {
        const { setClass } = this;

        // Set container classes
        setClass(this.components.container, 'wrapper');

        const container = setClass(document.createElement('div'), 'container');
        const content = setClass(this.components.content, 'content');

        // Mount elements
        this.container.textContent = '';
        this.components.container = container;

        this.container.setAttribute('tabindex', '0');
        this.container.appendChild(container);
        container.appendChild(content);

        // Add slides in their content box
        this.slides.forEach((slide, key) => {
            // Create the card container
            const slideContainer = this.createWithAttributes('div', {
                children: setClass(slide, 'card'),
            });
            content.appendChild(setClass(slideContainer, 'card-container'));

            // Set data-id attribute
            slideContainer.setAttribute('data-id', key.toString());

            // Set classes for the slide of image type
            setClass(slide, 'card');
            slide instanceof HTMLImageElement && setClass(slide, 'image');

            // Set the card as the new slide
            this.slides[key] = slideContainer;
        });
    }

    // Extends event listeners with game's own properties
    // /!\ : listeners, rawListeners properties missing

    addListener<T extends keyof (Events & FlexCardsEvents)>(
            event: T,
            listener: (Events & FlexCardsEvents)[T] | VoidFunction,
        ) {
        return super.addListener(event as string, listener as (...args: any[]) => void);
    }

    emit<T extends keyof (Events & FlexCardsEvents)>(event: T, ...args: any[]) {
        return super.emit(event as string, ...args);
    }

    listenerCount<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
    ) {
        return super.listenerCount(event as string);
    }

    off<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
        listener: (Events & FlexCardsEvents)[T] | VoidFunction,
    ) {
        return super.off(event as string, listener as (...args: any[]) => void);
    }

    on<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
        listener: (Events & FlexCardsEvents)[T] | VoidFunction,
    ) {
        return super.on(event as string | symbol, listener as (...args: any[]) => void);
    }

    once<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
        listener: (Events & FlexCardsEvents)[T] | VoidFunction,
    ) {
        return super.once(event as string, listener as (...args: any[]) => void);
    }

    prependListener<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
        listener: (Events & FlexCardsEvents)[T] | VoidFunction,
    ) {
        return super.prependListener(event as string, listener as (...args: any[]) => void);
    }

    prependOnceListener<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
        listener: (Events & FlexCardsEvents)[T] | VoidFunction,
    ) {
        return super.prependOnceListener(event as string, listener as (...args: any[]) => void);
    }

    removeAllListeners<T extends keyof (Events & FlexCardsEvents)>(event: T) {
        return super.removeAllListeners(event as unknown as string | symbol);
    }

    removeListener<T extends keyof (Events & FlexCardsEvents)>(
        event: T,
        listener: (Events & FlexCardsEvents)[T] | VoidFunction,
    ) {
        return super.removeListener(event as string, listener as (...args: any[]) => void);
    }
}

export default FlexCards;
