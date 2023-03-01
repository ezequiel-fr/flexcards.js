/**
 * flexcards.js
 * 
 * @see https://github.com/TheRedMineTheRedMine/flexcards.js
 * @author TheRedMineTheRedMine <theredminedu51@gmail.com>
 * @copyright 2023 - 2024
 * @license TheUnlicense
 */


/**
 * Parameters that can be entered after initializing flexcards.js.
 * @interface FlexCardsParams
 */

interface FlexCardsParams {
    component?: 'default' | 'images';
    indexType?: 'numbers' | 'points';
    theme?: string;
    timer?: boolean;
};

/**
 * Same as `document.createElement(element)`.
 * 
 * @param element element to be created
 * @returns an HTML element
 */

function createElement<E = HTMLElement>(element: keyof HTMLElementTagNameMap) {
    return window.document.createElement(element, { is: undefined }) as unknown as E;
}

/**
 * Returns the first element that is a descendant of node that matches selectors. Otherwise return
 * a default element (by default a `div` element).
 * 
 * @param element selector.
 * @param defaultElement default element created if not exists.
 * @returns HTML element.
 */

function querySelector(element: string, defaultElement: keyof HTMLElementTagNameMap = "div") {
    try {
        let el = document.querySelector(element);
        if (el) return el;
        else throw '';
    } catch (err) {
        return createElement(defaultElement);
    }
}

class FlexCards {

    /** @var length number of items */
    private length: number = 0;

    /** @var "animation-time" */
    private readonly "animation-time" = 550;

    /** @var "refresh-time" */
    private "refresh-time" = 250;

    /** @var delay delay between toggling to the next item. */
    public delay = 6000;

    /** @var index */
    public index = 0;

    /** @var timeElapsed */
    public timeElapsed = 0;

    /** @var getElapsed */
    private getElapsed = setInterval(() => void 0, this.delay);

    /** @var slides list of items */
    protected slides: Array<HTMLElement> = [];

    /** @var components dictionary of used components */
    protected components: Record<string, any> = Object();

    /** @var container the HTML container used to render the `flexcards.js` instance */
    protected readonly container: HTMLElement;

    /** @var interval the interval used to automate the scroll */
    protected interval: number = setInterval(() => void 0, this.delay);


    /**
     * New flexbox.js instance.
     * @param element HTML selector.
     */

    constructor (element: string) {
        this.container = querySelector(element) as HTMLDivElement;
    }

    /**
     * Set up the necessary components.
     * @returns generated components.
     */

    private mount({
        component = "default",
        indexType = "points",
        theme = "#666",
        timer = false,
    }: FlexCardsParams) {
        // Get slides and set length attr
        this.slides = Array.from(this.container.querySelectorAll(
            component === 'default' ? 'article' : 'img'
        ));
        this.length = this.slides.length;

        // Get color theme
        theme = theme.replace('#', '');
        theme = theme.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_m, r, g, b) => r+r+g+g+b+b);
        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme);

        let rgb = result // Parse numbers from hexadecimal to decimal
            ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
            : [0, 0, 0],
            filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();

        // Create components
        let container = createElement<HTMLDivElement>('div'),
            content = createElement<HTMLDivElement>('div'),
            index = createElement<HTMLDivElement>('div'),
            arrow_a = createElement<HTMLButtonElement>('button'),
            arrow_b = createElement<HTMLButtonElement>('button'),
            image_a = createElement<HTMLImageElement>('img'),
            image_b = createElement<HTMLImageElement>('img'),
            timerDisplay = createElement('span');

        // Add classes
        container.classList.add('flexcards__container');
        content.classList.add('flexcards__content');
        index.classList.add('flexcards__index');
        arrow_a.classList.add('flexcards__arrow', 'left');
        arrow_b.classList.add('flexcards__arrow', 'right');
        image_a.classList.add('flexcards__carret');
        image_b.classList.add('flexcards__carret');

        // And others attributes
        index.style.setProperty('--theme', "#" + theme);
        arrow_a.type = "button";
        arrow_b.type = "button";
        arrow_a.style.filter = filter;
        arrow_b.style.filter = filter;
        image_a.src = "../assets/icons/carret.svg";
        image_a.alt = "Toggle left";
        image_b.src = "../assets/icons/carret.svg";
        image_b.alt = "Toggle right";

        if (timer) { // Create timer
            let iterations = this.delay / this["refresh-time"] * 2;

            timerDisplay.classList.add('flexcards__timer');
            timerDisplay.style.setProperty('--theme', "#" + theme);
            timerDisplay.style.transitionDuration = `${iterations}ms`;

            container.append(timerDisplay);

            // Animation function
            setInterval(() => timerDisplay.style.setProperty('--percentage', (
                this.timeElapsed / this.delay * 200
            ).toString()), iterations);
        }

        // Mount components
        this.container.classList.add("flexcards__wrapper");
        this.container.innerHTML = "";

        this.container.append(container, index);
        arrow_a.appendChild(image_a);
        arrow_b.appendChild(image_b);
        container.append(arrow_a, content, arrow_b);

        // Index (numbers)
        if (indexType === 'numbers') {
            let current = createElement('span'), limit = createElement('span');

            current.classList.add('flexcards__count');
            limit.classList.add('flexcards__limit');

            current.innerHTML = "1";
            limit.innerHTML = this.length.toString();

            index.append(current, '/', limit);
        }

        this.slides.forEach((slide, key) => {
            // Indexing points
            if (indexType === 'points') {
                let circle = createElement('span');
                circle.classList.add('flexcards__point');
                if (!key) circle.classList.add('current');

                circle.onclick = () => (function (this: FlexCards) {
                    let count = key - this.index;

                    for (let i = 0; i < Math.abs(count); i++) {
                        if (count < 0) arrow_a.click();
                        else if (count > 0) arrow_b.click();
                    }
                }).call(this);

                index.appendChild(circle);
            }

            // Add slides in the content box
            content.appendChild(slide);
            slide.classList.add('flexcards__card');
            if (component === 'images') slide.classList.add('flexcards__image');
            slide.setAttribute('data-id', key.toString());
        }, this);

        // Get time elapsed
        let adder = this.delay / this["refresh-time"];
        this.getElapsed = setInterval(() => this.timeElapsed += adder, adder);

        return {
            arrows: { left: arrow_a, right: arrow_b },
            container, content, index,
            timer: (timer ? timerDisplay : null),
        };
    }


    /**
     * Display an amazing carousel for your items.
     */

    public carousel(params?: FlexCardsParams) {
        // Mount components
        const components = this.mount(params || Object());
        this.container.classList.add('flexcards__carousel');

        // Change slide when |scroll| >= 5%
        function onScroll() {
            let calc = 100 * (components.content.scrollLeft / components.content.clientWidth - 1);

            // Change slide if >= 5%
            if (calc >= 5) components.arrows.right.click();
            else if (calc <= -5) components.arrows.left.click();
        }

        // Render function
        function render(this: FlexCards, step: number = 0) {
            // Re-init time elapsed
            this.timeElapsed = 0;

            const updateContent = () => {
                // put the animation in this function
                components.content.querySelectorAll('article').forEach(el => {
                    el.classList.remove('animate');
                    el.remove();
                });

                // Add items in a specific order
                components.content.append(
                    this.slides[(this.index - 1 < 0 ? this.length : this.index) - 1],
                    this.slides[this.index],
                    this.slides[this.index + 1 >= this.length ? 0 : this.index + 1],
                );

                components.content.scroll({ left: components.content.clientWidth });
                this.slides[this.index].classList.add('animate');
                components.content.addEventListener('scroll', onScroll);

                if (components.timer) components.timer.style.setProperty('--percentage', '0');
            };

            if (Math.abs(step)) { // If step != 0 (have to scroll)
                components.content.removeEventListener('scroll', onScroll);
                components.content.scroll({
                    left: components.content.clientWidth * (1 + step),
                    behavior: 'smooth',
                });

                setTimeout(updateContent, this["animation-time"]);
            } else updateContent();

            // Toggle index
            if (params?.indexType && params.indexType === 'numbers') {
                querySelector('.flexcards__wrapper .flexcards__index .flexcards__count')
                    .innerHTML = (this.index + 1).toString();
            } else {
                components.index.querySelectorAll('span').forEach((point, key) => {
                    point.classList[this.index === key ? 'add' : 'remove']('current');
                });
            }

            // Re-set "auto-scroll"
            this.interval = setInterval(() => components.arrows.right.click(), this.delay);
        }

        function onClick(this: FlexCards, ev: MouseEvent) {
            clearInterval(this.interval);

            let arrow = ev.currentTarget as HTMLButtonElement;
            let initialIndex = this.index;

            this.index += Number(arrow.classList.contains('left')) * -2 + 1;

            // Check if index is a num between 0 and length
            if (this.index < 0) {
                this.index = this.length - 1;
                initialIndex = this.length;
            } else if (this.index >= this.length) {
                this.index = 0;
                initialIndex = -1;
            }

            // And then render the result
            render.call(this, this.index - initialIndex);
            arrow.blur();
        }

        // Apply onClick event
        [components.arrows.left, components.arrows.right].forEach(
            arrow => arrow.onclick = e => onClick.call(this, e)
        );

        // Seems strange, but removing this line, the code won't work properly :(
        components.content.addEventListener('scroll', onScroll);

        // Return components and render a first time to complete setup.
        this.components = components;
        render.call(this);
    }

    /** Stop */
    public stop() { clearInterval(this.interval); }
}

class RGBtoHSL {
    private r: number;
    private g: number;
    private b: number;

    private target: RGBtoHSL;
    private targetHSL: { h: number; s: number; l: number };

    constructor(r: number, g: number, b: number) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);

        this.target = this;
        this.targetHSL = this.target.hsl();
    }

    private clamp(value: number) {
        if (value > 255) { value = 255; }
        else if(value < 0) { value = 0; }
        return value;
    }

    private multiply(matrix: number[]) {
        let newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]),
            newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]),
            newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);

        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    private hueRotate(angle = 0) {
        angle = angle / 180 * Math.PI;
        let sin = Math.sin(angle), cos = Math.cos(angle);

        this.multiply([
            .213 + cos * .787 - sin * .213,
            .715 - cos * .715 - sin * .715,
            .072 - cos * .072 + sin * .928,
            .213 - cos * .213 + sin * .143,
            .715 + cos * .285 + sin * .140,
            .072 - cos * .072 - sin * .283,
            .213 - cos * .213 - sin * .787,
            .715 - cos * .715 + sin * .715,
            .072 + cos * .928 + sin * .072
        ]);
    }

    private sepia(value = 1) {
        this.multiply([
            0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)
        ]);
    }

    private saturate(value = 1) {
        this.multiply([
            0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value,
            0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value,
            0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value
        ]);
    }

    private brightness(value = 1) { this.linear(value) }
    private contrast(value = 1) { this.linear(value, -(.5 * value) + .5) }

    private linear(slope = 1, intercept = 0) {
        this.r = this.clamp(this.r * slope + intercept * 255);
        this.g = this.clamp(this.g * slope + intercept * 255);
        this.b = this.clamp(this.b * slope + intercept * 255);
    }

    private invert(value = 1) {
        this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
        this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
        this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
    }

    private hsl() {
        let r = this.r / 255,
            g = this.g / 255,
            b = this.b / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if(max === min) h = s = 0;
        else {
            let d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 100, s: s * 100, l: l * 100 };
    }

    public solve() {
        let result = this.solveNarrow(this.solveWide());
        return this.toString(result.values);
    }

    private solveWide() {
        const A = 5, c = 15, a = [60, 180, 18000, 600, 1.2, 1.2];
        let best: { loss: number, values: number[] } = { loss: Infinity, values: [] };

        for (let i = 0; best.loss > 25 && i < 3; i++) {
            let initial = [50, 20, 3750, 50, 100, 100];
            let result = this.spsa(A, a, c, initial, 1000);

            if(result.loss < best.loss) best = result;
        }

        return best;
    }

    private solveNarrow(wide: { loss: number, values: number[] }) {
        const A = wide.loss;
        const c = 2, A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];

        return this.spsa(A, a, c, wide.values, 500);
    }

    private spsa(A: number, a: number[], c: number, values: number[], iters: number) {
        const alpha = 1, gamma = 1/6;

        let best = null,
            bestLoss = Infinity,
            deltas = new Array(6),
            highArgs = new Array(6),
            lowArgs = new Array(6);

        function fix(value: number, idx: number) {
            let max = 100;

            if (idx === 2) max = 7500;
            else if (idx === 4 || idx === 5) max = 200;

            if (idx === 3) {
                if (value > max) value %= max;
                else if (value < 0) value = max + value % max;
            } else if (value < 0) value = 0;
            else if (value > max) value = max;

            return value;
        }

        for (let k = 0; k < iters; k++) {
            let ck = c / Math.pow(k + 1, gamma);

            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > .5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            let lossDiff = this.loss(highArgs) - this.loss(lowArgs);

            for (let i = 0; i < 6; i++) {
                let g = lossDiff / (2 * ck) * deltas[i];
                let ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }

            let loss = this.loss(values);

            if (loss < bestLoss) {
                best = values.slice(0);
                bestLoss = loss;
            }
        }

        return { values: best || [], loss: bestLoss };
    }

    private loss(filters: number[]) {
        let color = new RGBtoHSL(0, 0, 0);

        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6); // 100 * 360
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);

        let colorHSL = color.hsl();

        return Math.abs(color.r - this.target.r) + Math.abs(colorHSL.h - this.targetHSL.h)
             + Math.abs(color.g - this.target.g) + Math.abs(colorHSL.s - this.targetHSL.s)
             + Math.abs(color.b - this.target.b) + Math.abs(colorHSL.l - this.targetHSL.l);
    }

    private toString(filters: number[]) {
        const fmt = (idx: number, multiplier = 1) => Math.round(filters[idx] * multiplier);

        return `invert(${fmt(0)}%) `     + `sepia(${fmt(1)}%) `
             + `saturate(${fmt(2)}%) `   + `hue-rotate(${fmt(3, 3.6)}deg) `
             + `brightness(${fmt(4)}%) ` + `contrast(${fmt(5)}%)`;
    }
}
