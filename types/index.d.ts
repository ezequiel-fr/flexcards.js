interface FlexCardsOptions {
    components: "default" | "images";
}

// flexcards props
declare class FlexCards {
    public container: HTMLDivElement;

    public length: number;
    public slides: (HTMLElement | HTMLImageElement)[];

    constructor(element: string, options?: FlexCardsOptions);

    protected initWithStyles(...styles: string[]): void;
}

declare module 'flexcardsjs' {
    export class Carousel extends FlexCards {
        // carousel props
    }

    const flexcardsjs: {
        Carousel: typeof Carousel,
    };

    export default flexcardsjs;
}
