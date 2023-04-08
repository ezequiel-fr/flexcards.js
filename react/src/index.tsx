import React from 'react';

import RGBtoHSL from './color';
import { CProps, FlexCardsParams, ICProps } from './types';

type IntervalReturn = NodeJS.Timeout | number;

type ReactRef<T = HTMLElement> = React.MutableRefObject<T>;

const setClass = (firstToken: string, ...tokens: string[]) => (
    ["flexcards__" + firstToken, ...(tokens.length
        ? tokens.join(" ").replace(/  +/g, " ").split(" ")
        : []
    )].join(' ')
).trim();

function init() {
    // Set up main stylesheet
    if (!document.getElementById('flexcards-style')) {
        const css = document.createElement('link');

        css.type = "text/css";
        css.rel = "stylesheet";
        css.id = "flexcards-style";
        css.href = URL.createObjectURL(new Blob([
            '.flexcards__wrapper{position:relative!important;display:flex;flex-flow:column nowrap',
            ';align-items:center;-webkit-user-select:none;-moz-user-select:none;user-select:none}',
            '.flexcards__wrapper .flexcards__container{display:flex;justify-content:center;align-',
            'items:center;position:relative;overflow:hidden;height:100%;width:100%}.flexcards__wr',
            'apper .flexcards__container .flexcards__timer{display:block;position:absolute;width:',
            '100%;height:5px;z-index:2;top:0}.flexcards__wrapper .flexcards__container .flexcards',
            '__timer::after,.flexcards__wrapper .flexcards__container .flexcards__timer::before{c',
            'ontent:"";display:block;position:absolute;height:5px;z-index:2;top:0;background:var(',
            '--theme)}.flexcards__wrapper .flexcards__container .flexcards__timer::before{width:1',
            '00%;opacity:.4}.flexcards__wrapper .flexcards__container .flexcards__timer::after{tr',
            'ansition:all linear;width:calc(var(--size) * .5%);opacity:.75}.flexcards__wrapper .f',
            'lexcards__container .flexcards__content{display:flex;width:100%;height:100%;z-index:',
            '1;overflow:scroll hidden;scroll-behavior:auto}.flexcards__wrapper .flexcards__contai',
            'ner .flexcards__content .flexcards__card{position:relative;min-width:100%;width:100%',
            ';height:100%;overflow:hidden;-webkit-user-select:inherit;-moz-user-select:inherit;us',
            'er-select:inherit}.flexcards__wrapper .flexcards__container .flexcards__content .fle',
            'xcards__card.flexcards__image{display:flex;flex-direction:column;justify-content:cen',
            'ter;align-items:center;-o-object-fit:cover;object-fit:cover;-webkit-user-select:none',
            ';-moz-user-select:none;user-select:none}.flexcards__wrapper .flexcards__container .f',
            'lexcards__content::-webkit-scrollbar{-webkit-appearance:none;appearance:none;display',
            ':none}.flexcards__wrapper .flexcards__container .flexcards__arrow{position:absolute;',
            'background:0 0;height:100%;width:30px;cursor:pointer;z-index:2;outline:0;border:none',
            ';transform:none;transition:all .2s ease;display:flex;flex-direction:column;align-ite',
            'ms:center;justify-content:center}.flexcards__wrapper .flexcards__container .flexcard',
            's__arrow .flexcards__carret{position:relative;width:21px;-o-object-fit:contain;objec',
            't-fit:contain;pointer-events:none;display:block}.flexcards__wrapper .flexcards__cont',
            'ainer .flexcards__arrow.left{left:0}.flexcards__wrapper .flexcards__container .flexc',
            'ards__arrow.left img{transform:scaleX(-1)}.flexcards__wrapper .flexcards__container ',
            '.flexcards__arrow.right{right:0}.flexcards__wrapper .flexcards__container .flexcards',
            '__arrow:focus,.flexcards__wrapper .flexcards__container .flexcards__arrow:hover{tran',
            'sform:scale(107%)}.flexcards__wrapper .flexcards__index{display:flex;justify-content',
            ':center;align-items:center;position:absolute;height:20px;min-width:29px;padding:1px ',
            '5px;bottom:5px;gap:5px;z-index:2;color:var(--theme)}.flexcards__wrapper .flexcards__',
            'index .flexcards__dot{width:12px;height:12px;border-radius:60%;background:var(--them',
            'e);transition:all .2s;cursor:pointer;opacity:.4}.flexcards__wrapper .flexcards__inde',
            'x .flexcards__dot:hover{opacity:65%}.flexcards__wrapper .flexcards__index .flexcards',
            '__dot.current{opacity:75%}.flexcards__wrapper .flexcards__index .flexcards__count,.f',
            'lexcards__wrapper .flexcards__index .flexcards__limit{pointer-events:none}'
        ], { type: "text/css" }));

        document.head.appendChild(css);
        css.addEventListener('load', () => URL.revokeObjectURL(css.href));
    }
}

export const Component = React.forwardRef<HTMLElement, CProps>(({ children, ...params }, ref) => (
    <article {...params} className={setClass('card', params.className || "")} ref={ref}>
        {children}
    </article>
));

export const ImageComponent = React.forwardRef<HTMLImageElement, ICProps>((params, ref) => (
    <img
        {...params}
        className={setClass('card', setClass('image'), params.className || "")}
        ref={ref}
    />
));

export const Carousel: React.FC<FlexCardsParams> = ({
    colorized = true,
    delay = 6e3,
    indexType = "dots",
    refreshTime = 250,
    timer = true,
    arrowUrl, ...params
}) => {
    const arrow_a = React.useRef<HTMLButtonElement>(document.createElement('button'));
    const arrow_b = React.useRef<HTMLButtonElement>(document.createElement('button'));
    const content = React.useRef<HTMLDivElement>(document.createElement('div'));
    const indexDisplay = React.useRef<HTMLDivElement>(document.createElement('div'));
    const timerDisplay = React.useRef<HTMLSpanElement>(document.createElement('span'));

    const children = (React.Children.toArray(params.children) as React.ReactElement[]).map(
        (el, key) => React.cloneElement(el, { "data-id": key })
    ).sort((a, b) => Number(a.props["data-id"] > b.props["data-id"] - 1));

    const { length } = children;

    var getElapsed: IntervalReturn = setInterval(() => void 0),
        index = 0,
        interval: { id: IntervalReturn, func: Function } = {
            id: setInterval(() => void 0, 1e8), func: () => void 0
        },
        playing = false,
        slides: ReactRef[] = [],
        timeElapsed = 0;

    // Arrow URL
    if (!(arrowUrl && arrowUrl.length)) {
        arrowUrl = URL.createObjectURL(new Blob([
            '<svg width="54px" height="116px" xmlns="http://www.w3.org/2000/svg"><path d="M8 8,l3',
            '8 48,L8 108" fill="transparent" stroke="#000" stroke-width="15" stroke-linejoin="rou',
            'nd" stroke-linecap="round" /></svg>',
        ], { type: "image/svg+xml" }));

        setTimeout(URL.revokeObjectURL, undefined, arrowUrl);
    }

    // Set theme
    let theme = params.theme || "#444";

    theme = theme.replace('#', '');
    theme = theme.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r+r+g+g+b+b);

    const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme);

    let rgb = result // HEX to DEC
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0],
        filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();

    // Initialize
    init();

    const getOrder = (arr: any[], step = 1) => {
        step %= arr.length;

        return arr.map((_, b) => arr[
            b + (arr[b + step] ? step
                : Math.sign(-step) * (arr.length - Math.abs(step))
            )
        ]);
    }

    const setSlides = (s: ReactRef[]) => s.forEach((slide, key) => {
        slides[key] = slide;
        content.current.appendChild(slide.current);
    });

    /** @const scrollStep positive number */
    const scrollStep = Math.abs(Math.round(children.length / 2 - 1));

	// Scroll shortcuts
	const scrollContent = (x: number, behavior: ScrollBehavior = "auto") => content.current.scroll(
		{ left: content.current.clientWidth * x, behavior }
	);
	const resetScroll = () => scrollContent(scrollStep);

    function render(step = 0) {
        // Remove interval and reset time elapsed
        pause();
        timeElapsed = 0

		index += step;

        // Index must be between 0 and length
        if (index < 0) index += length;
        else if (index >= length) index = 0;

        // Scroll and then change order
		content.current.removeEventListener('scroll', onScroll);
        let order = getOrder(slides, step), i = 0;

		while (order[scrollStep].current.dataset.id !== index.toString() && i <= index) {
			order = getOrder(order, step);
			i++;
		}

        scrollContent(scrollStep + step, "smooth");

        setTimeout(() => {
            setSlides(order), resetScroll();
            setTimeout(() => content.current.addEventListener('scroll', onScroll));
        }, step === 0 ? 0 : 600);

        // Toggle index
        indexDisplay.current.querySelectorAll('span').forEach(el =>
            el.dispatchEvent(new Event('update'))
        );

        // Reset intervals
        play();
    }

    function play() {
        // Delay protection
        delay = Math.abs(delay);

        // Calculate interval
        let intervalDelay = Math.abs(delay - timeElapsed);
        if (intervalDelay > delay) intervalDelay = delay.valueOf();

        if (!playing) {
            let adder = delay / refreshTime;

            interval.id = setInterval(interval.func, intervalDelay);
            getElapsed = setInterval(() => timeElapsed += adder, adder);
        }

        // Change playing state to true
        playing = true;
    }

    function pause() {
        clearInterval(interval.id);
        clearInterval(getElapsed);

        // Change playing state to false
        playing = false;
    }

    React.useEffect(() => {
        // Interval function
        interval.func = () => arrow_b.current.click();

        // Set timer
        if (timer) {
            let iterations = delay / refreshTime * 2;

            timerDisplay.current.style.setProperty('--theme', "#" + theme);
            timerDisplay.current.style.transitionDuration = iterations + "ms";

            // Animation function
            setInterval(() => timerDisplay.current.style.setProperty(
                '--size', (timeElapsed / delay * 200).toString()
            ), iterations);
        }

        // Indexing event
        indexDisplay.current.querySelectorAll('span').forEach((e, key) => e.addEventListener(
            'update', function () {
                if (e.classList.value.includes(setClass('dot')))
                    e.classList[index === key ? 'add' : 'remove']('current');
                else if (e.classList.value.includes(setClass('count')))
                    e.textContent = (index + 1).toString();
            }
        ));

        // Color theme
        if (colorized) {
            arrow_a.current.style.filter = filter;
            arrow_b.current.style.filter = filter;
        }
        indexDisplay.current.style.setProperty('--theme', "#" + theme);

        // Window resized event (prevent glitch)
        resetScroll();
        window.addEventListener('resize', resetScroll);

        // Scroll event fix
        content.current.addEventListener('scroll', onScroll);

        // First render
        render();
    });

    // Arrow events
    const onArrowClick = (ev: React.MouseEvent<HTMLButtonElement>, step = 0) => {
        render(step);
        ev.currentTarget.blur();
    };

    // Scroll event
	let isScrolling = setTimeout(() => void 0, delay);

    const onScroll = () => {
        let calc = content.current.scrollLeft / (content.current.clientWidth * scrollStep),
			direction = 0;

        calc = Math.round(calc * 100);
		direction = Math.sign(calc);
		clearTimeout(isScrolling);

        isScrolling = setTimeout(() => (
			Math.abs(calc) >= 4
				? render(direction)
				: scrollContent(scrollStep, "smooth")
		), refreshTime * .4);
    }

    // Dot clicked
    const dotClicked = (key: number) => {
        let target = slides.find(a => a.current.dataset?.id === key.toString());
        render(slides.findIndex(a => a == target) - scrollStep);
    };

    return (
        <div {...params} className={setClass('wrapper', params.className || "")}>
            <div className={setClass('container')}>
                {timer && (
                    <span className={setClass('timer')} ref={timerDisplay}></span>
                )}

                <button
                    className={setClass('arrow', 'left')}
                    ref={arrow_a}
                    onClick={e => onArrowClick(e, -1)}
                >
                    <img className={setClass('carret')} src={arrowUrl} alt="Toggle left" />
                </button>

                <div className={setClass('content')} ref={content}>
                    {getOrder(children, -scrollStep).map((el, key) => {
                        slides[key] = React.useRef<HTMLDivElement>(document.createElement('div'));
                        return React.cloneElement(el, { ref: slides[key] });
                    })}
                </div>

                <button
                    className={setClass('arrow', 'right')}
                    ref={arrow_b}
                    onClick={e => onArrowClick(e, 1)}
                >
                    <img className={setClass('carret')} src={arrowUrl} alt="Toggle right" />
                </button>
            </div>

            <div className={setClass('index')} ref={indexDisplay}>
                {indexType !== "none" && (indexType === "dots" ? (
                    Array.from(new Uint8Array(slides.length)).map((_, key) => (
                        <span
                            key={key}
                            className={setClass('dot')}
                            onClick={() => dotClicked(key)}
                        ></span>
                    ))
                ) : (
                    <React.Fragment>
                        <span className={setClass('count')}>1</span>
                        <span>/</span>
                        <span className={setClass('limit')}>{slides.length}</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
