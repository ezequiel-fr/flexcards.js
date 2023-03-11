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
    carousel(): void;
}
