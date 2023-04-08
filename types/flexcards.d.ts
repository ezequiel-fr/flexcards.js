interface FlexCardsComponents {
    container: HTMLDivElement;
    content: HTMLDivElement;
    index: HTMLDivElement;
    timer?: HTMLSpanElement;
}
declare type FlexCardsOptions = {
    components: "default" | "images";
};
/**
 * The FlexCards parameters to apply to the instance.\
 * The `flexcards.js` instance provided an HTML `<div>`, and here, you can customize or add your
 * own properties, like CSS or className...
 */
interface FlexCardsParams extends Object {
    /** The arrow image url (by default provide a custom SVG image) */
    arrowUrl?: string;
    /** Apply a filter or not to the arrow (works better on SVG dark arrows) */
    colorized?: boolean;
    /** The delay used between every changes */
    delay?: number;
    /** Show the index display to be on top of the carousel */
    indexType?: "dots" | "numbers" | "none";
    /** Hexadecimal color code to apply to the instance */
    theme?: string;
    /** Indicate wether a progress bar should be displayed at the top of the instance or not */
    timer?: boolean;
}
/** @const setClass qui shorthand for HTML classes */
declare const setClass: (token: string) => string;
/**
 * flexcards.js - A powerful JavaScript library to make your website better.
 *
 * @see https://github.com/TheRedMineTheRedMine/flexcards.js
 * @author TheRedMineTheRedMine <theredminedu51@gmail.com>
 * @copyright 2023 - 2024
 * @license TheUnlicense
 */
declare class FlexCards {
    /** @var components components list */
    components: FlexCardsComponents;
    /** @var container the HTML conainer used to render the current `flexcards.js` instance */
    container: HTMLDivElement;
    /** @var delay delay before next slide */
    delay: number;
    /** @var getElapsed get elapsed time */
    private getElapsed;
    /** @var index current slide */
    protected index: number;
    /** @var interval informations */
    protected interval: {
        id: number;
        func: Function;
    };
    /** @var length slides count */
    readonly length: number;
    /** @var playing current instance playing or not */
    playing: boolean;
    /** @var "refresh-time" refresh times per seconds */
    "refresh-time": number;
    /** @var slides list of all slides */
    slides: (HTMLElement | HTMLImageElement)[];
    /** @var timeElapsed time elapsed since begin */
    timeElapsed: number;
    /**
     * Permits creating a new FlexCards instance.
     * @param element the JavaScript element selector.
     */
    constructor(element: string, options?: FlexCardsOptions);
    carousel(params?: FlexCardsParams): void;
    pause(): void;
    play(): void;
}
/**
 * Customized code found in this
 * [StackOverflow subject](https://stackoverflow.com/a/42966641/604861).\
 * So all credits goes to the post on this topic, and espcially to MultiplyByZer0.
 */
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
