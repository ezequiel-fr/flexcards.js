import FlexCards, { FlexCardsOptions } from './utils/flexcards';

class Carousel extends FlexCards {
    constructor(element: string, components?: FlexCardsOptions) {
        super(element, components);
        this.initContainer();
    }
}

export default Carousel;
