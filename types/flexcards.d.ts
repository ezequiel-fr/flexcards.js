interface FlexCardsParams extends Object {
    indexType?: "dots" | "numbers";
    theme?: string;
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
    /** @var components */
    components: Record<('container' | 'content' | 'index' | (string & {})), HTMLElement>;
    /** @var container the HTML conainer used to render the current `flexcards.js` instance */
    container: HTMLDivElement;
    /** @var delay */
    delay: number;
    /** @var index */
    protected index: number;
    /** @var interval */
    protected interval: number;
    /** @var length */
    readonly length: number;
    /** @var slides */
    slides: HTMLElement[];
    /** @var timeElapsed */
    timeElapsed: number;
    /**
     * Permits creating a new FlexCards instance.
     * @param element the JavaScript element selector.
     */
    constructor(element: string);
    carousel(params?: FlexCardsParams): void;
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
