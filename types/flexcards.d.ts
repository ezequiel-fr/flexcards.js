interface FlexCardsComponents {
    container: HTMLDivElement;
    content: HTMLDivElement;
    index: HTMLDivElement;
    timer?: HTMLSpanElement;
}
declare type FlexCardsOptions = {
    components: "default" | "images";
};
interface FlexCardsParams extends Object {
    arrowUrl?: string;
    colorized?: boolean;
    indexType?: "dots" | "numbers";
    theme?: string;
    timer?: boolean;
}
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
