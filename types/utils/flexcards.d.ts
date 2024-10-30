/// <reference types="node" />
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
type Children = {
    children?: HTMLElement;
};
/** FlexCards events */
interface FlexCardsEvents {
    ready: () => void;
}
/** FlexCards class */
declare abstract class FlexCards<Components = Record<string, HTMLElement>, Events = FlexCardsEvents> extends EventEmitter {
    /** The container element. */
    container: HTMLDivElement;
    /** The components of the FlexCards instance. */
    components: FlexCardsComponents & Components;
    /** The slides (childs) of the FlexCards instance. */
    slides: (HTMLElement | HTMLImageElement)[];
    /** The theme of the FlexCards instance. */
    theme: string;
    /** The current state of the FlexCards instance. */
    currentState: number;
    /** Pending state of an instance. */
    static readonly PENDING = 0;
    /** Ready state of an instance. */
    static readonly READY = 1;
    /**
     * Create a new FlexCards instance.
     *
     * @param element The element to initialize the component with.
     * @param options The options to initialize the component with.
     */
    constructor(element: string, options?: FlexCardsOptions);
    /**
     * Set classes to an element.
     *
     * @param element The element to set classes to.
     * @param classes The classes to set.
     * @returns The element with the classes set.
     */
    protected setClass<T extends HTMLElement>(element: T, ...classes: string[]): T;
    /**
     * Create an element with attributes.
     *
     * @param tagName The tag name of the element.
     * @param attributes The attributes to add to the element.
     * @returns The created element.
     */
    protected createWithAttributes<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes?: Omit<Partial<HTMLElementTagNameMap[K]>, 'children'> & Children): HTMLElementTagNameMap[K];
    /**
     * Initialize the FlexCards component.
     *
     * @param options The options to initialize the component with.
     * @returns The FlexCards instance.
     */
    protected initContainer(): void;
    addListener<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
    emit<T extends keyof (Events & FlexCardsEvents)>(event: T, ...args: any[]): boolean;
    listenerCount<T extends keyof (Events & FlexCardsEvents)>(event: T): number;
    off<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
    on<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
    once<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
    prependListener<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
    prependOnceListener<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
    removeAllListeners<T extends keyof (Events & FlexCardsEvents)>(event: T): this;
    removeListener<T extends keyof (Events & FlexCardsEvents)>(event: T, listener: (Events & FlexCardsEvents)[T] | VoidFunction): this;
}
export default FlexCards;
