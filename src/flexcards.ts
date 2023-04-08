interface FlexCardsComponents {
    container: HTMLDivElement;
    content: HTMLDivElement;
    index: HTMLDivElement;
    timer?: HTMLSpanElement;
}

type FlexCardsOptions = { components: "default" | "images" };

/**
 * The FlexCards parameters to apply to the instance.\
 * The `flexcards.js` instance provided an HTML `<div>`, and here, you can customize or add your
 * own properties, like CSS or className...
 */
interface FlexCardsParams extends Object {
    /** The arrow image url (by default provide a custom SVG image) */
    arrowUrl?: string;
    /** Apply a filter or not to the arrow (works better on SVG dark arrows) */
    colorized?: boolean;
    /** The delay used between every changes */
    delay?: number;
    /** Show the index display to be on top of the carousel */
    indexType?: "dots" | "numbers" | "none";
    /** Hexadecimal color code to apply to the instance */
    theme?: string;
    /** Indicate wether a progress bar should be displayed at the top of the instance or not */
    timer?: boolean;
}

/** @const setClass qui shorthand for HTML classes */
const setClass = (token: string) => "flexcards__" + token;

/**
 * flexcards.js - A powerful JavaScript library to make your website better.
 * 
 * @see https://github.com/TheRedMineTheRedMine/flexcards.js
 * @author TheRedMineTheRedMine <theredminedu51@gmail.com>
 * @copyright 2023 - 2024
 * @license TheUnlicense
 */

class FlexCards {

    /** @var components components list */
    public components: FlexCardsComponents;

    /** @var container the HTML conainer used to render the current `flexcards.js` instance */
    public container: HTMLDivElement;

    /** @var delay delay before next slide */
    public delay = 6e3;

    /** @var getElapsed get elapsed time */
    private getElapsed: { delay: number, func: Function, id: number } = {
        delay: this.delay,
        id: setInterval(() => void 0, 1e8),
        func: () => void 0,
    };

    /** @var index current slide */
    protected index = 0;

    /** @var interval informations */
    protected interval: { id: number, func: Function } = {
        id: setInterval(() => void 0, 1e8),
        func: () => void 0,
    };

    /** @var length slides count */
    public readonly length;

    /** @var playing current instance playing or not */
    public playing: boolean = false;

    /** @var "refresh-time" refresh times per seconds */
    public "refresh-time" = 250;

    /** @var slides list of all slides */
    public slides: (HTMLElement | HTMLImageElement)[];

    /** @var timeElapsed time elapsed since begin */
    public timeElapsed = 0;


    /**
     * Permits creating a new FlexCards instance.
     * @param element the JavaScript element selector.
     */

    constructor(element: string, options: FlexCardsOptions = { components: "default" }) {
        // Set up main element that will be used.
        try {
            let elExists = document.querySelector<HTMLDivElement>(element);
            if (elExists) this.container = elExists;
            else throw '';
        } catch (error) {
            console.warn("The provided selector doesn't exists.");
            this.container = document.createElement('div');
        }

        // Set up main StyleSheet
        if (!document.getElementById('flexcards-style')) {
            const css = document.createElement('link');

            css.type = "text/css";
            css.rel = "stylesheet";
            css.id = "flexcards-style";

            css.href = URL.createObjectURL(new Blob([
                '.flexcards__wrapper{position:relative!important;display:flex;flex-flow:column no',
                'wrap;align-items:center;-webkit-user-select:none;-moz-user-select:none;user-sele',
                'ct:none}.flexcards__wrapper .flexcards__container{display:flex;justify-content:c',
                'enter;align-items:center;position:relative;overflow:hidden;height:100%;width:100',
                '%}.flexcards__wrapper .flexcards__container .flexcards__timer{display:block;posi',
                'tion:absolute;width:100%;height:5px;z-index:2;top:0}.flexcards__wrapper .flexcar',
                'ds__container .flexcards__timer::after,.flexcards__wrapper .flexcards__container',
                ' .flexcards__timer::before{content:"";display:block;position:absolute;height:5px',
                ';z-index:2;top:0;background:var(--theme)}.flexcards__wrapper .flexcards__contain',
                'er .flexcards__timer::before{width:100%;opacity:.4}.flexcards__wrapper .flexcard',
                's__container .flexcards__timer::after{transition:all linear;width:calc(var(--siz',
                'e) * .5%);opacity:.75}.flexcards__wrapper .flexcards__container .flexcards__cont',
                'ent{display:flex;width:100%;height:100%;z-index:1;overflow:scroll hidden;scroll-',
                'behavior:auto}.flexcards__wrapper .flexcards__container .flexcards__content .fle',
                'xcards__card{position:relative;min-width:100%;width:100%;height:100%;overflow:hi',
                'dden;-webkit-user-select:inherit;-moz-user-select:inherit;user-select:inherit}.f',
                'lexcards__wrapper .flexcards__container .flexcards__content .flexcards__card.fle',
                'xcards__image{display:flex;flex-direction:column;justify-content:center;align-it',
                'ems:center;-o-object-fit:cover;object-fit:cover;-webkit-user-select:none;-moz-us',
                'er-select:none;user-select:none}.flexcards__wrapper .flexcards__container .flexc',
                'ards__content::-webkit-scrollbar{-webkit-appearance:none;appearance:none;display',
                ':none}.flexcards__wrapper .flexcards__container .flexcards__arrow{position:absol',
                'ute;background:0 0;height:100%;width:30px;cursor:pointer;z-index:2;outline:0;bor',
                'der:none;transform:none;transition:all .2s ease;display:flex;flex-direction:colu',
                'mn;align-items:center;justify-content:center}.flexcards__wrapper .flexcards__con',
                'tainer .flexcards__arrow .flexcards__carret{position:relative;width:21px;-o-obje',
                'ct-fit:contain;object-fit:contain;pointer-events:none;display:block}.flexcards__',
                'wrapper .flexcards__container .flexcards__arrow.left{left:0}.flexcards__wrapper ',
                '.flexcards__container .flexcards__arrow.left img{transform:scaleX(-1)}.flexcards',
                '__wrapper .flexcards__container .flexcards__arrow.right{right:0}.flexcards__wrap',
                'per .flexcards__container .flexcards__arrow:focus,.flexcards__wrapper .flexcards',
                '__container .flexcards__arrow:hover{transform:scale(107%)}.flexcards__wrapper .f',
                'lexcards__index{display:flex;justify-content:center;align-items:center;position:',
                'absolute;height:20px;min-width:29px;padding:1px 5px;bottom:5px;gap:5px;z-index:2',
                ';color:var(--theme)}.flexcards__wrapper .flexcards__index .flexcards__dot{width:',
                '12px;height:12px;border-radius:60%;background:var(--theme);transition:all .2s;cu',
                'rsor:pointer;opacity:.4}.flexcards__wrapper .flexcards__index .flexcards__dot:ho',
                'ver{opacity:65%}.flexcards__wrapper .flexcards__index .flexcards__dot.current{op',
                'acity:75%}.flexcards__wrapper .flexcards__index .flexcards__count,.flexcards__wr',
                'apper .flexcards__index .flexcards__limit{pointer-events:none}',
            ], { type: "text/css" }));

            document.head.appendChild(css);
            css.addEventListener('load', () => URL.revokeObjectURL(css.href));
        }

        // Get time elapsed
        let adder = this.delay / this["refresh-time"];
        this.getElapsed.func = () => this.timeElapsed += adder;
        this.getElapsed.delay = adder;

        // Set bases
        this.slides = Array.from(this.container.querySelectorAll(
            options.components === "default" ? "article" : "img"
        ));
        this.length = this.slides.length;

        this.container.classList.add(setClass('wrapper'));

        let container = document.createElement("div"),
            content = document.createElement("div"),
            index = document.createElement("div");

        container.classList.add(setClass('container'));
        content.classList.add(setClass('content'));
        index.classList.add(setClass('index'));

        // Mount components
        this.container.textContent = "";
        this.container.append(container, index);
        container.append(content);

        // Add slides in the content box
        this.slides.forEach((slide, key) => {
            content.appendChild(slide);
            slide.classList.add(setClass('card'));
            slide.setAttribute('data-id', key.toString());

            options.components === "images" && slide.classList.add(setClass('image'));
        });

        this.components = { container, content, index };
    }

    public carousel(params: FlexCardsParams = {
        colorized: true,
        delay: undefined,
        indexType: "dots",
        theme: "#444",
        timer: true,
    }) {
        const { container, content, index } = this.components;

        // Get new slides order
        const getOrder = (arr: any[], step = 1) => {
            step %= this.length;

            return arr.map((_a, b) => arr[
                b + (arr[b + step] ? step
                    : Math.sign(-step) * (this.length - Math.abs(step))
                )
            ]);
        };

        // Set new delay
        if (params.delay) this.delay = Math.abs(params.delay);

        // Set slides
        const setSlides = (slides: HTMLElement[]) => slides.forEach((slide, key) => {
            this.slides[key] = slide;
            content.appendChild(slide);
        });

        // Scroll shortcuts
        const scrollContent = (x: number, behavior: ScrollBehavior = "auto") => content.scroll({
            left: content.clientWidth * x, behavior
        });
        const resetScroll = () => scrollContent(scrollStep);

        // Apply a first order
        /** @const scrollStep positive number */
        const scrollStep = Math.abs(Math.round(this.length / 2 - 1));

        setSlides(getOrder(this.slides, -scrollStep));
        resetScroll();

        // Window resized event (prevent glitch)
        window.addEventListener('resize', resetScroll);

        // Set arrows
        let arrow_a = document.createElement("button"),
            arrow_b = document.createElement("button"),
            image_a = new Image(),
            image_b = new Image();

        arrow_a.classList.add(setClass('arrow'), 'left');
        arrow_b.classList.add(setClass('arrow'), 'right');
        image_a.classList.add(setClass('carret'));
        image_b.classList.add(setClass('carret'));

        arrow_a.type = "button";
        arrow_b.type = "button";
        image_a.alt = "Toggle left";
        image_b.alt = "Toggle right";

        arrow_a.appendChild(image_a);
        arrow_b.appendChild(image_b);
        container.insertBefore(arrow_a, content);
        container.appendChild(arrow_b);

        this.interval.func = () => arrow_b.click();

        // Set image content
        if (params.arrowUrl) {
            image_a.src = params.arrowUrl;
            image_b.src = params.arrowUrl;
        } else {
            let imageUrl = URL.createObjectURL(new Blob([
                '<svg width="54px" height="116px" xmlns="http://www.w3.org/2000/svg">',
                '<path d="M8 8,l38 48,L8 108" fill="transparent" stroke="#000" stroke-width="15"',
                ' stroke-linejoin="round" stroke-linecap="round"/></svg>'
            ], { type: "image/svg+xml" }));

            image_a.src = imageUrl;
            image_b.src = imageUrl;

            let count = 0, checkImageLoaded = function () {
                count++, (count === 2 && URL.revokeObjectURL(imageUrl));
            };

            image_a.addEventListener('load', () => checkImageLoaded);
            image_b.addEventListener('load', () => checkImageLoaded);
        }

        // Set theme
        let theme = params.theme || "#444";

        theme = theme.replace('#', '');
        theme = theme.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r+r+g+g+b+b);

        if (!params.hasOwnProperty('colorized') || params.colorized) {
            const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme);

            let rgb = result // Hex to Dec
                ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                : [0, 0, 0],
                filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();

            arrow_a.style.filter = filter;
            arrow_b.style.filter = filter;
        }

        // Set timer
        if (!params.hasOwnProperty('timer') || params.timer) {
            const timerDisplay = document.createElement('span');
            let iterations = this.delay / this["refresh-time"] * 2;

            timerDisplay.classList.add(setClass('timer'));
            timerDisplay.style.setProperty('--theme', "#" + theme);
            timerDisplay.style.transitionDuration = iterations + "ms";

            container.insertBefore(timerDisplay, arrow_a);
            this.components.timer = timerDisplay;

            // Animation function
            setInterval(() => timerDisplay.style.setProperty('--size', (
                this.timeElapsed / this.delay * 200
            ).toString()), iterations);
        }

        index.style.setProperty('--theme', "#" + theme);

        // Set index
        if (params.hasOwnProperty('indexType')) {
            if (params.indexType === "numbers") {
                let current = document.createElement('span'),
                    limit = document.createElement('span');

                current.classList.add(setClass('count'));
                limit.classList.add(setClass('limit'));

                current.textContent = "1";
                limit.innerHTML = this.length.toString();

                // Change value on update
                current.addEventListener('update', () => (
                    current.textContent = (this.index + 1).toString()
                ));

                index.append(current, '/', limit);
            } else this.slides.forEach((_, key) => {
                let dot = document.createElement("span");

                dot.classList.add(setClass('dot'));

                // On a dot clicked, change current slide
                dot.onclick = () => (function(this: FlexCards) {
                    let target = this.slides.filter(a => a.dataset?.id === key.toString())[0],
                        step = this.slides.map((a, b) => a == target?b:0).reduce((a, b) => a+b);

                    render.call(this, step - Math.round(this.length / 2) + 1);
                }).call(this);

                dot.addEventListener('update', () => dot.classList[
                    this.index === key ? 'add' : 'remove'
                ]('current'));

                index.appendChild(dot);
            });
        }

        // render function
        function render(this: FlexCards, step: number = 0) {            
            // Remove interval and reset time elapsed
            this.pause();
            this.timeElapsed = 0;

            this.index += step;

            // Index must be between 0 and length
            if (this.index < 0) this.index += this.length;
            else if (this.index >= this.length) this.index = 0;

            // Scroll and then change order
            content.removeEventListener('scroll', onScroll);
            let order = getOrder(this.slides, step), i = 0;

            while (order[scrollStep].dataset.id !== this.index.toString() && i <= this.index) {
                order = getOrder(order, step);
                i++;
            }

            if (step !== 0) {
                scrollContent(scrollStep + step, "smooth");

                setTimeout(() => {
                    setSlides(order), resetScroll();
                    setTimeout(() => content.addEventListener('scroll', onScroll));
                }, 600);
            } else setTimeout(resetScroll, this["refresh-time"] * .4);

            // Toggle index
            index.querySelectorAll('span').forEach(el => el.dispatchEvent(new Event('update')));

            // Reset intervals
            this.play();
        }

        // Arrow events
        function onArrowClick(this: FlexCards, ev: MouseEvent) {
            let arrow = ev.currentTarget as HTMLButtonElement;

            render.call(this, Number(arrow.classList.contains('left')) * -2 + 1);
            arrow.blur();
        }

        // Scroll event
        let isScrolling = setTimeout(() => void 0, this.delay);

        const onScroll = () => {
            let calc = content.scrollLeft / (content.clientWidth * scrollStep) - 1,
                direction = 0;

            calc = Math.round(calc * 100);
            direction = Math.sign(calc);
            clearTimeout(isScrolling);

            isScrolling = setTimeout(() => (
                Math.abs(calc) >= 4
                    ? render.call(this, direction)
                    : scrollContent(scrollStep, "smooth")
            ), this["refresh-time"] * .4);
        }

        // onclick function (arrows)
        [arrow_a, arrow_b].forEach(arrow => arrow.onclick = e => onArrowClick.call(this, e));

        // Scroll event fix
        content.addEventListener('scroll', onScroll);

        // First render
        render.call(this);
    }

    public pause() {
        clearInterval(this.interval.id);
        clearInterval(this.getElapsed.id);

        // Change playing state to false
        this.playing = false;
    }

    public play() {
        // Delay protection
        this.delay = Math.abs(this.delay);

        // Calculate interval
        let interval = Math.abs(this.delay - this.timeElapsed);
        if (interval > this.delay) interval = this.delay;

        if (!this.playing) {
            this.interval.id = setInterval(this.interval.func, interval);
            this.getElapsed.id = setInterval(this.getElapsed.func, this.getElapsed.delay);
        }

        // Change playing state to true
        this.playing = true;
    }
}

/**
 * Customized code found in this
 * [StackOverflow subject](https://stackoverflow.com/a/42966641/604861).\
 * So all credits goes to the post on this topic, and espcially to MultiplyByZer0.
 */
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

            if (loss < bestLoss) { // @ts-ignore
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
        const format = (idx: number, multiplier = 1) => Math.round(filters[idx] * multiplier);

        return `invert(${format(0)}%) `     + `sepia(${format(1)}%) `
             + `saturate(${format(2)}%) `   + `hue-rotate(${format(3, 3.6)}deg) `
             + `brightness(${format(4)}%) ` + `contrast(${format(5)}%)`;
    }
}
