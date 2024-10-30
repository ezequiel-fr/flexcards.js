import FlexCards, { FlexCardsOptions } from './utils/flexcards';
type Optional<T, K> = {
    [K in keyof T]?: T[K];
};
/** Carousel options */
interface CarouselOptions extends Optional<FlexCardsOptions, 'components'> {
    /** Delay before next slide */
    delay?: number;
    /** Autoplay slides */
    autoplay?: boolean;
    /** Loop slides */
    loop?: boolean;
    /** Type of index to display at the bottom */
    displayIndex?: "none" | "dots" | "numbers";
    /** Show control arrows on each side */
    arrows?: boolean;
    /** Custom arrow image source (a default one is provided) */
    arrowSrc?: string;
    /** Progress bar at the top */
    progressBar?: boolean;
}
/** Carousel elements */
interface CarouselElements {
    /** Control arrows */
    arrows?: {
        left: HTMLButtonElement;
        right: HTMLButtonElement;
    };
    /** Index container (bottom) */
    index?: HTMLDivElement;
    /** Progress bar (top) */
    progressBar?: HTMLSpanElement;
}
/** Carousel events */
interface CarouselEvents {
    /** Animation start event, occurs when a slide is changing */
    animationStart: (slides: [old: number, new: number]) => void;
    /** Animation end event, occurs when a slide has changed */
    animationEnd: () => void;
    /** Pause event */
    pause: () => void;
    /** Play event */
    play: () => void;
}
/**
 * Display a carousel of slides, with autoplay, arrows, and other options.
 * @class Carousel
 * @extends FlexCards
 * @template CarouselElements, CarouselEvents
 */
declare class Carousel extends FlexCards<CarouselElements, CarouselEvents> {
    /** @var delay delay before next slide */
    private _delay;
    /** @var autoplay autoplay slides */
    private autoplay;
    /** @var loop loop slides */
    private loop;
    /** @var displayIndex type of index to display at the bottom */
    private displayIndex;
    /** @var currentSlide current slide index */
    private currentSlide;
    /** @var index current slide index (do not change manually !) */
    index: number;
    private scrollStep;
    /** @var playing whether the carousel is playing */
    private playing;
    /** @var interval interval for autoplay */
    private interval;
    /** @var getElapsedTime interval for elapsed time */
    private getElapsedTime;
    /** @var elapsedTime elapsed time since last slide */
    elapsedTime: number;
    /**
     * Create a new carousel
     * @param element element to use as carousel container
     * @param options carousel options
     */
    constructor(element: string, options?: CarouselOptions);
    private set setCurrentSlide(value);
    /**
     * Get delay between each slides
     * @return delay before next slide (in ms)
     * @public
     */
    get delay(): number;
    /**
     * Set delay before next slide
     * @param value delay before next slide (in ms)
     * @public
     * @return void
     */
    set delay(value: number);
    /** Set the scrollStep value */
    private updateScrollStep;
    /**
     * Set slides in the carousel
     * @param slides HTMLElement[]
     */
    private setSlides;
    /** Get new slides order */
    private getOrder;
    /**
     * Scroll the content to the next slide
     * @param x number of slides to scroll
     * @param behavior scroll behavior
     * @private
     */
    private scrollContent;
    /** Reset the scroll to the center of the carousel */
    private resetScroll;
    /** Basically, render the carousel based one the changing `step` */
    private showSlide;
    /** Reset the timer for autoplay */
    private resetTimer;
    /**
     * Show next slide
     * @return void
     * @public
     */
    next(step?: number): void;
    /**
     * Show previous slide
     * @public
     */
    prev(step?: number): void;
    /**
     * Play the carousel
     * @public
     */
    play(): this;
    /**
     * Pause the carousel
     * @public
     */
    pause(): this;
}
export default Carousel;
