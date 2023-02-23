declare function createElement<E = HTMLElement>(element: keyof HTMLElementTagNameMap): E;
declare function querySelector(element: string, defaultElement?: keyof HTMLElementTagNameMap): Element;
declare class FlexCards {
    private readonly width;
    private readonly height;
    delay: number;
    "animation-time": number;
    protected container: HTMLElement;
    protected articles: NodeListOf<HTMLElement>;
    constructor(element: string);
    private mount;
}
