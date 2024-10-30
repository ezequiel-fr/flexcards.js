import RGBtoHSL from './utils/colors';
import FlexCards, { FlexCardsOptions } from './utils/flexcards';

/* Makes attributes optional */
type Optional<T, K> = { [K in keyof T]?: T[K] };

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
class Carousel extends FlexCards<CarouselElements, CarouselEvents> {
    /** @var delay delay before next slide */
    #_delay = 6e3;

    /** @var autoplay autoplay slides */
    #autoplay: boolean;
    /** @var loop loop slides */
    #loop: boolean;
    /** @var displayIndex type of index to display at the bottom */
    #displayIndex: Omit<CarouselOptions["displayIndex"], "none"> | null = null;

    /** @var currentSlide current slide index */
    #currentSlide = 0;
    /** @var index current slide index (do not change manually !) */
    public index = 0;

    // work constants
    #scrollStep = 0;
    /** @var playing whether the carousel is playing */
    #playing = false;

    // intervals
    /** @var interval interval for autoplay */
    #interval = {
        delay: 1e8,
        id: setInterval(() => void 0, 1e8),
        fn: this.next.bind(this),
    };

    /** @var getElapsedTime interval for elapsed time */
    #getElapsedTime = {
        id: setInterval(() => void 0, 1e8),
        fn: () => this.elapsedTime += 20,
    };

    /** @var elapsedTime elapsed time since last slide */
    public elapsedTime = 0;

    /**
     * Create a new carousel
     * @param element element to use as carousel container
     * @param options carousel options
     */
    constructor(element: string, options?: CarouselOptions) {
        // Initialize carousel
        super(element, {
            components: "default",
            ...options,
        });
        this.initContainer();

        // Set options
        options?.delay && (this.delay = options.delay);

        this.#autoplay = options?.autoplay ?? true;
        this.#loop = options?.loop ?? true;

        if (options?.displayIndex) {
            this.#displayIndex = ["dots", "numbers"].includes(options.displayIndex)
                ? options.displayIndex
                : null;
        }

        // Apply a first order
        this.#updateScrollStep();

        this.#setSlides(this.#getOrder(this.slides, -this.#scrollStep));
        this.#resetScroll();

        // Set indexing if displayIndex is enabled
        if (this.#displayIndex) {
            // Create index container
            const index = this.setClass(document.createElement('div'), 'components', 'index')
            index.style.setProperty('--color', "#" + this.theme);

            this.components.index = index;
            this.container.appendChild(index);

            // Create index elements
            if (this.#displayIndex === "dots") {
                this.slides.forEach((_, key) => {
                    const dot = this.setClass(document.createElement('span'), 'dot');

                    // Set element properties
                    dot.dataset.id = key.toString();
                    index.appendChild(dot);

                    // Add event listener (animations)
                    this.on('animationStart', ([old, newSlide]) => {
                        if (old === key) {
                            setTimeout(() => dot.classList.remove('current'), 300);
                        } else if (newSlide === key) {
                            setTimeout(() => dot.classList.add('current'), 300);
                        }
                    });

                    // Set current dot
                    this.on('ready', () => dot.classList.toggle('current', key === this.index));

                    // On click event, change slide
                    dot.onclick = () => {
                        const target = this.slides.findIndex(slide => (
                            slide.dataset.id === key.toString()
                        ));

                        // Check if the target is valid
                        if (target < 0) return this.#showSlide(0);

                        // Reset timer
                        this.#resetTimer();

                        // Toggle current slide
                        this.#setCurrentSlide = target;
                        this.#showSlide(target - Math.round(this.slides.length / 2) + 1);
                    };
                });
            } else if (this.#displayIndex === "numbers") {
                const current = this.setClass(this.createWithAttributes('span', {
                    textContent: (this.index + 1).toString(),
                }), 'count');
                const limit = this.setClass(this.createWithAttributes('span', {
                    innerHTML: this.slides.length.toString(),
                }), 'limit');

                index.append(current, "/", limit);

                // Update slide number on change
                this.on('animationStart', () => setTimeout(() => {
                    current.textContent = (this.index + 1).toString();
                }, 300));
            }
        }

        // Set arrows if enabled (default: true)
        if (options?.arrows ?? true) {
            // Create arrow elements
            const left = this.setClass(
                this.createWithAttributes('button', { className: 'left', type: 'button' }),
                'arrow',
            );
            const right = this.setClass(
                this.createWithAttributes('button', { className: 'right', type: 'button' }),
                'arrow',
            );

            this.components.arrows = { left, right };
            this.components.content.before(left);
            this.components.content.after(right);

            // set arrows image
            const imageUrl = URL.createObjectURL(new Blob([
                '<svg width="54px" height="116px" xmlns="http://www.w3.org/2000/svg">',
                '<path d="M8 8,l38 48,L8 108" fill="transparent" stroke="#000" stroke-width="15"',
                    ' stroke-linejoin="round" stroke-linecap="round"/>',
                '</svg>',
            ], { type: "image/svg+xml" }));

            const imageLeft = this.setClass(this.createWithAttributes('img', {
                alt: 'Toggle left',
                src: options?.arrowSrc ?? imageUrl,
            }), 'carret');
            const imageRight = this.setClass(this.createWithAttributes('img', {
                alt: 'Toggle right',
                src: options?.arrowSrc ?? imageUrl,
            }), 'carret');

            left.appendChild(imageLeft);
            right.appendChild(imageRight);

            if (options?.arrowSrc) {
                URL.revokeObjectURL(imageUrl);
            } else {
                // Set custom ob class
                this.setClass(imageLeft, 'ob');
                this.setClass(imageRight, 'ob');

                // Set arrow color
                const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.theme);

                let rgb = result // Hex to Dec
                    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                    : [0, 0, 0],
                    filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();

                imageLeft.style.filter = filter;
                imageRight.style.filter = filter;
            }

            // Set arrow listeners
            const arrowClick = (arrow: HTMLButtonElement) => {
                // Reset timer
                this.#resetTimer();
                // Blur the button
                arrow.blur();
            };

            left.onclick = () => (this.prev(), arrowClick(left));
            right.onclick = () => (this.next(), arrowClick(right));
        }

        // Set progress bar if enabled (default: false)
        if (options?.progressBar) {
            const progressBar = this.setClass(
                document.createElement('span'),
                'components', 'time-indicator',
            );

            progressBar.style.setProperty('--p', '0');
            progressBar.style.setProperty('--color', "#" + this.theme);

            this.components.progressBar = progressBar;
            this.components.container.before(progressBar);

            // Animation
            setInterval(() => progressBar.style.setProperty(
                '--p', `${this.elapsedTime / this.delay * 200}`,
            ), 20);
        }

        // Set some event listeners
        this.on('play', () => this.#playing = true);
        this.on('pause', () => this.#playing = false);

        // Toggle in ready state
        this.emit('ready');

        // Play if autoplay is enabled
        this.#autoplay && this.play();

        // Reset scroll on resize
        window.addEventListener('resize', this.#resetScroll);
    }

    set #setCurrentSlide(value: number) {
        this.#currentSlide += value;

        if (this.#currentSlide < 0) {
            this.#currentSlide = this.slides.length - (this.#currentSlide % this.slides.length);
        } else {
            this.#currentSlide %= this.slides.length;
        }
    }

    /** 
     * Get delay between each slides
     * @return delay before next slide (in ms)
     * @public
     */
    public get delay() {
        return this.#_delay;
    }

    /**
     * Set delay before next slide
     * @param value delay before next slide (in ms)
     * @public
     * @return void
     */
    public set delay(value: number) {
        this.#_delay = Math.max(Math.abs(value), 600);
    }

    /** Set the scrollStep value */
    #updateScrollStep() {
        this.#scrollStep = Math.abs(Math.round(this.slides.length / 2 - 1));
    }

    /** 
     * Set slides in the carousel
     * @param slides HTMLElement[]
     */
    #setSlides(slides: HTMLElement[]) {
        slides.forEach((slide, key) => {
            this.slides[key] = slide;
            this.components.content.appendChild(slide);
        });
    }

    /** Get new slides order */
    #getOrder<T>(arr: T[], step = 1) {
        step %= this.slides.length;

        return arr.map((_, key) => arr[
            key + (arr[key + step]
                ? step
                : Math.sign(-step) * (this.slides.length - Math.abs(step))
            )
        ]);
    };

    /** 
     * Scroll the content to the next slide
     * @param x number of slides to scroll
     * @param behavior scroll behavior
     * @private
     */
    #scrollContent(x: number, behavior: ScrollBehavior = "auto") {
        this.components.content.scroll({
            left: this.components.content.clientWidth * x,
            behavior,
        });
    }

    /** Reset the scroll to the center of the carousel */
    #resetScroll = () => this.#scrollContent(this.#scrollStep);

    /** Basically, render the carousel based one the changing `step` */
    #showSlide(step: number) {
        const oldIndex = this.index;
        this.index = (oldIndex + step + this.slides.length) % this.slides.length;

        // Get new order
        let order = this.#getOrder(this.slides, step),
            i = 0;

        while (order[this.#scrollStep].dataset?.id !== this.index.toString() && i <= this.index) {
            order = this.#getOrder(order, step);
            i++;
        }

        // Reset elapsed time
        this.elapsedTime = 0;

        // emit animation start event if step is not 0
        step && this.emit('animationStart', [oldIndex, this.index]);

        // remove scroll event listener
        // ...

        if (step) {
            // scroll to next (smooth), update order, scroll to center (instant)
            this.#scrollContent(this.#scrollStep + step, "smooth");

            setTimeout(() => {
                this.#setSlides(order);
                this.#resetScroll();

                step && this.emit('animationEnd');
            }, 600);
        } else {
            setTimeout(this.#resetScroll, 100);
        }

        // Reset timer
        this.#resetTimer();
    }

    /** Reset the timer for autoplay */
    #resetTimer() {
        // Stop the carousel (intervals involved in)
        clearInterval(this.#interval.id);

        this.#interval.id = setInterval(() => {
            if (this.#currentSlide === this.slides.length - 1 && !this.#loop) {
                this.pause();
            } else {
                this.#interval.fn();
            }
        }, this.delay);
        this.#interval.delay = this.delay;

        // Reset elapsed time
        this.elapsedTime = 0;
    }

    /**
     * Show next slide
     * @return void
     * @public
     */
    public next(step = 1) {
        // Check if step is a valid number
        step = +Math.abs(Math.round(step));
        if (!step || Number.isNaN(step)) return;

        // Set new slide
        this.#setCurrentSlide = step;
        this.#showSlide(step);
    }

    /**
     * Show previous slide
     * @public
     */
    public prev(step = 1) {
        // Check if step is a valid number
        step = -Math.abs(Math.round(step));
        if (!step || Number.isNaN(step)) return;

        // Set new slide
        this.#setCurrentSlide = step;
        this.#showSlide(step);
    }

    /**
     * Play the carousel
     * @public
     */
    public play() {
        if (!this.#loop && this.#currentSlide === this.slides.length - 1) {
            // Reset current slide to 0 and restart
            this.next();

            // Play if autoplay is enabled
            this.#autoplay && this.play();
        } else if (!this.#playing) {
            // Calc remaining time
            const remaining = Math.min(Math.abs(this.delay - this.elapsedTime), this.delay);

            // Set intervals
            this.#interval.id = setInterval(() => {
                if (this.#currentSlide === this.slides.length - 1 && !this.#loop) {
                    this.pause();
                } else {
                    this.#interval.fn();
                }
            }, remaining);
            this.#interval.delay = remaining;

            this.#getElapsedTime.id = setInterval(this.#getElapsedTime.fn, 20);

            // Emit play event
            this.emit('play');
        }

        // Update playing state
        this.#playing = true;

        return this;
    }

    /**
     * Pause the carousel
     * @public
     */
    public pause() {
        // Clear intervals
        clearInterval(this.#interval.id);
        clearInterval(this.#getElapsedTime.id);

        // Emit pause event
        this.emit('pause');
        // Update playing state
        this.#playing = false;

        return this;
    }
}

export default Carousel;
