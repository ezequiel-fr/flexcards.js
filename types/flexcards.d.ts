/**
 * flexcards.js
 *
 * @see https://github.com/TheRedMineTheRedMine/flexcards.js
 * @author TheRedMineTheRedMine <theredminedu51@gmail.com>
 * @copyright 2023 - 2024
 * @license TheUnlicense
 */
/**
 * Parameters that can be entered after initializing flexcards.js.
 * @interface FlexCardsParams
 */
interface FlexCardsParams {
    component?: 'default' | 'images';
    indexType?: 'numbers' | 'points';
    theme?: string;
    timer?: boolean;
}
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
    private length;
    /** @var "animation-time" */
    private readonly "animation-time";
    /** @var "refresh-time" */
    private "refresh-time";
    /** @var delay delay between toggling to the next item. */
    delay: number;
    /** @var index */
    index: number;
    /** @var timeElapsed */
    timeElapsed: number;
    /** @var getElapsed */
    private getElapsed;
    /** @var slides list of items */
    protected slides: Array<HTMLElement>;
    /** @var components dictionary of used components */
    protected components: Record<string, any>;
    /** @var container the HTML container used to render the `flexcards.js` instance */
    protected readonly container: HTMLElement;
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
    carousel(params?: FlexCardsParams): void;
    /** Stop */
    stop(): void;
}
declare class RGBtoHSL {
    private r;
    private g;
    private b;
    private target;
    private targetHSL;
    constructor(r: number, g: number, b: number);
    private clamp;
    private multiply;
    private hueRotate;
    private sepia;
    private saturate;
    private brightness;
    private contrast;
    private linear;
    private invert;
    private hsl;
    solve(): string;
    private solveWide;
    private solveNarrow;
    private spsa;
    private loss;
    private toString;
}
