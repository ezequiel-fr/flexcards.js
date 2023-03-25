"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carousel = exports.ImageComponent = exports.Component = void 0;
const react_1 = __importDefault(require("react"));
const color_1 = __importDefault(require("./color"));
const setClass = (firstToken, ...tokens) => (["flexcards__" + firstToken, ...(tokens.length
        ? tokens.join(" ").replace(/  +/g, " ").split(" ")
        : [])].join(' ')).trim();
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
        setTimeout(URL.revokeObjectURL, undefined, css.href);
    }
}
exports.Component = react_1.default.forwardRef((_a, ref) => {
    var { children } = _a, params = __rest(_a, ["children"]);
    return (<article {...params} className={setClass('card', params.className || "")} ref={ref}>
        {children}
    </article>);
});
exports.ImageComponent = react_1.default.forwardRef((params, ref) => (<img {...params} className={setClass('card', setClass('image'), params.className || "")} ref={ref}/>));
const Carousel = (_a) => {
    var { colorized = true, delay = 6e3, indexType = "dots", refreshTime = 250, timer = true, arrowUrl } = _a, params = __rest(_a, ["colorized", "delay", "indexType", "refreshTime", "timer", "arrowUrl"]);
    const arrow_a = react_1.default.useRef(document.createElement('button'));
    const arrow_b = react_1.default.useRef(document.createElement('button'));
    const content = react_1.default.useRef(document.createElement('div'));
    const indexDisplay = react_1.default.useRef(document.createElement('div'));
    const timerDisplay = react_1.default.useRef(document.createElement('span'));
    const children = react_1.default.Children.toArray(params.children).map((el, key) => react_1.default.cloneElement(el, { "data-id": key })).sort((a, b) => Number(a.props["data-id"] > b.props["data-id"] - 1));
    const { length } = children;
    var getElapsed = setInterval(() => void 0), index = 0, interval = {
        id: setInterval(() => void 0, 1e8), func: () => void 0
    }, playing = false, slides = [], timeElapsed = 0;
    // Arrow URL
    if (!(arrowUrl && arrowUrl.length)) {
        arrowUrl = URL.createObjectURL(new Blob([
            '<svg width="54px" height="116px" xmlns="http://www.w3.org/2000/svg"><path d="M8 8,l3',
            '8 48,L8 108" fill="transparent" stroke="#000" stroke-width="15" stroke-linejoin="rou',
            'nd" stroke-linecap="round" /></svg>',
        ], { type: "image/svg+xml" }));
        setTimeout(URL.revokeObjectURL, undefined, arrowUrl);
    }
    const resetScroll = () => content.current.scroll({
        left: content.current.clientWidth * scrollStep, behavior: "auto"
    });
    // Set theme
    let theme = params.theme || "#444";
    theme = theme.replace('#', '');
    theme = theme.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
    const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme);
    let rgb = result // HEX to DEC
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0], filter = new color_1.default(rgb[0], rgb[1], rgb[2]).solve();
    // Initialize
    init();
    const getOrder = (arr, step = 1) => {
        step %= arr.length;
        return arr.map((_, b) => arr[b + (arr[b + step] ? step
            : Math.sign(-step) * (arr.length - Math.abs(step)))]);
    };
    const setSlides = (s) => s.forEach((slide, key) => {
        slides[key] = slide;
        content.current.appendChild(slide.current);
    });
    /** @const scrollStep positive number */
    const scrollStep = Math.abs(Math.round(children.length / 2 - 1));
    function render(step = 0) {
        index += step;
        // Remove interval and reset time elapsed
        pause();
        timeElapsed = 0;
        // Index must be between 0 and length
        if (index < 0)
            index += length;
        else if (index >= length)
            index %= length;
        // Scroll and then change order
        let order = getOrder(slides, step);
        while (order[scrollStep].current.dataset.id !== index.toString())
            order = getOrder(order, step);
        content.current.removeEventListener('scroll', onScroll);
        content.current.scroll({
            left: content.current.clientWidth * (scrollStep + step),
            behavior: "smooth",
        });
        setTimeout(() => {
            setSlides(order);
            resetScroll();
            // content.current.addEventListener('scroll', onScroll);
        }, 600);
        // Toggle index
        indexDisplay.current.querySelectorAll('span').forEach(el => el.dispatchEvent(new Event('update')));
        // Reset intervals
        play();
    }
    function play() {
        // Delay protection
        delay = Math.abs(delay);
        // Calculate interval
        let intervalDelay = Math.abs(delay - timeElapsed);
        if (intervalDelay > delay)
            intervalDelay = delay.valueOf();
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
    react_1.default.useEffect(() => {
        // Interval function
        interval.func = () => arrow_b.current.click();
        // Set timer
        if (timer) {
            let iterations = delay / refreshTime * 2;
            timerDisplay.current.style.setProperty('--theme', "#" + theme);
            timerDisplay.current.style.transitionDuration = iterations + "ms";
            // Animation function
            setInterval(() => timerDisplay.current.style.setProperty('--size', (timeElapsed / delay * 200).toString()), iterations);
        }
        // Indexing event
        indexDisplay.current.querySelectorAll('span').forEach((e, key) => e.addEventListener('update', function () {
            if (e.classList.value.includes(setClass('dot')))
                e.classList[index === key ? 'add' : 'remove']('current');
            else if (e.classList.value.includes(setClass('count')))
                e.textContent = (index + 1).toString();
        }));
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
    const onArrowClick = (ev, step = 0) => {
        render(step);
        ev.currentTarget.blur();
    };
    // Scroll event
    const onScroll = () => {
        let calc = content.current.scrollLeft / (content.current.clientWidth * scrollStep);
        calc = Math.round(calc * 100);
        if (Math.abs(calc) >= 4)
            (Math.sign(calc) + 1 ? arrow_b : arrow_a).current.click();
    };
    // Dot clicked
    const dotClicked = (key) => {
        let target = slides.find(a => { var _a; return ((_a = a.current.dataset) === null || _a === void 0 ? void 0 : _a.id) === key.toString(); });
        render(slides.findIndex(a => a == target) - scrollStep);
    };
    return (<div {...params} className={setClass('wrapper', params.className || "")}>
            <div className={setClass('container')}>
                {timer && (<span className={setClass('timer')} ref={timerDisplay}></span>)}

                <button className={setClass('arrow', 'left')} ref={arrow_a} onClick={e => onArrowClick(e, -1)}>
                    <img className={setClass('carret')} src={arrowUrl} alt="Toggle left"/>
                </button>

                <div className={setClass('content')} ref={content}>
                    {getOrder(children, -scrollStep).map((el, key) => {
            slides[key] = react_1.default.useRef(document.createElement('div'));
            return react_1.default.cloneElement(el, { ref: slides[key] });
        })}
                </div>

                <button className={setClass('arrow', 'right')} ref={arrow_b} onClick={e => onArrowClick(e, 1)}>
                    <img className={setClass('carret')} src={arrowUrl} alt="Toggle right"/>
                </button>
            </div>

            <div className={setClass('index')} ref={indexDisplay}>
                {indexType !== "none" && (indexType === "dots" ? (Array.from(new Uint8Array(slides.length)).map((_, key) => (<span key={key} className={setClass('dot')} onClick={() => dotClicked(key)}></span>))) : (<react_1.default.Fragment>
                        <span className={setClass('count')}>1</span>
                        <span>/</span>
                        <span className={setClass('limit')}>{slides.length}</span>
                    </react_1.default.Fragment>))}
            </div>
        </div>);
};
exports.Carousel = Carousel;
