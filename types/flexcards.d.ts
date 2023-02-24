declare function createElement<E = HTMLElement>(element: keyof HTMLElementTagNameMap): E;
declare function querySelector(element: string, defaultElement?: keyof HTMLElementTagNameMap): Element;
declare class FlexCards {
    private readonly width;
    private readonly height;
    private readonly length;
    "animation-time": number;
    delay: number;
    index: number;
    protected articles: NodeListOf<HTMLElement>;
    protected components: Record<string, any>;
    protected container: HTMLElement;
    protected interval: number;
    constructor(element: string);
    private mount;
    carousel(): void;
}
