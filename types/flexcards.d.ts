/**
 * flexcards.js
 *
 * @see https://github.com/TheRedMineTheRedMine/flexcards.js
 * @author TheRedMineTheRedMine <theredminedu51@gmail.com>
 * @copyright 2023 - 2024
 * @license TheUnlicense
 */
/**
 * Same as `document.createElement(element)`.
 *
 * @param element element to be created
 * @returns an HTML element
 */
declare function createElement<E = HTMLElement>(element: keyof HTMLElementTagNameMap): E;
/**
 * Returns the first element that is a descendant of node that matches selectors. Otherwise return
 * a default element (by default a `div` element).
 *
 * @param element selector.
 * @param defaultElement default element created if not exists.
 * @returns HTML element.
 */
declare function querySelector(element: string, defaultElement?: keyof HTMLElementTagNameMap): Element;
declare class FlexCards {
    /** @var length number of items */
    private readonly length;
    /** @var "animation-time" */
    "animation-time": number;
    /** @var delay delay between toggling to the next item. */
    delay: number;
    /** @var index */
    index: number;
    /** @var articles list of items */
    protected articles: NodeListOf<HTMLElement>;
    /** @var components dictionary of used components */
    protected components: Record<string, any>;
    /** @var container the HTML container used to render the `flexcards.js` instance */
    protected container: HTMLElement;
    /** @var interval the interval used to automate the scroll */
    protected interval: number;
    /**
     * New flexbox.js instance.
     * @param element HTML selector.
     */
    constructor(element: string);
    /**
     * Set up the necessary components.
     * @returns generated components.
     */
    private mount;
    /**
     * Display an amazing carousel for your items.
     */
    carousel(): void;
}
