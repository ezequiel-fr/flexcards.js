"use strict";
const setClass = (token) => "flexcards__" + token;
/**
 * flexcards.js - A powerful JavaScript library to make your website better.
 *
 * @see https://github.com/TheRedMineTheRedMine/flexcards.js
 * @author TheRedMineTheRedMine <theredminedu51@gmail.com>
 * @copyright 2023 - 2024
 * @license TheUnlicense
 */
class FlexCards {
    /**
     * Permits creating a new FlexCards instance.
     * @param element the JavaScript element selector.
     */
    constructor(element) {
        /** @var delay */
        this.delay = 6e3;
        /** @var index */
        this.index = 0;
        /** @var interval */
        this.interval = setInterval(() => void 0, this.delay);
        /** @var timeElapsed */
        this.timeElapsed = 0;
        // Set up main element that will be used.
        try {
            let elExists = document.querySelector(element);
            if (elExists)
                this.container = elExists;
            else
                throw '';
        }
        catch (error) {
            console.warn("The provided selector doesn't exists.");
            this.container = document.createElement('div');
        }
        // Set up main StyleSheet
        // Set bases
        this.slides = Array.from(this.container.querySelectorAll('article'));
        this.length = this.slides.length;
        this.container.classList.add(setClass('wrapper'));
        let container = document.createElement("div"), content = document.createElement("div"), index = document.createElement("div");
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
        });
        this.components = { container, content, index };
    }
    carousel(params = {
        indexType: "dots",
        theme: "#444",
    }) {
        const { container, content, index } = this.components;
        // Get new slides order
        const getOrder = (step = 1) => {
            step = -(step % this.length);
            return this.slides.map((_a, b) => this.slides[b + (this.slides[b - step] ? -step
                : Math.sign(step) * (this.length - Math.abs(step)))]);
        };
        // Set slides
        const setSlides = (slides) => slides.forEach((slide, key) => {
            this.slides[key] = slide;
            content.appendChild(slide);
        });
        // Apply a first order
        const scrollStep = Math.abs(Math.round(this.length / 2 - 1));
        setSlides(getOrder(-scrollStep));
        content.scroll({ left: content.clientWidth * scrollStep, behavior: "auto" });
        // Set arrows
        let arrow_a = document.createElement("button"), arrow_b = document.createElement("button"), image_a = document.createElement("img"), image_b = document.createElement("img");
        arrow_a.classList.add(setClass('arrow'), 'left');
        arrow_b.classList.add(setClass('arrow'), 'right');
        image_a.classList.add(setClass('carret'));
        image_b.classList.add(setClass('carret'));
        arrow_a.type = "button";
        arrow_b.type = "button";
        image_a.alt = "Toggle left";
        image_b.alt = "Toggle right";
        image_a.src = "../assets/icons/carret.svg";
        image_b.src = "../assets/icons/carret.svg";
        arrow_a.appendChild(image_a);
        arrow_b.appendChild(image_b);
        container.insertBefore(arrow_a, content);
        container.appendChild(arrow_b);
        // Set theme
        let theme = params.theme || "#444";
        theme = theme.replace('#', '');
        theme = theme.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
        const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme);
        let rgb = result // Hex to Dec
            ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
            : [0, 0, 0], filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();
        arrow_a.style.filter = filter;
        arrow_b.style.filter = filter;
        index.style.setProperty('--theme', "#" + theme);
        // Set index
        if (params.hasOwnProperty('indexType')) {
            if (params.indexType === "numbers") {
                let current = document.createElement('span'), limit = document.createElement('span');
                current.classList.add(setClass('count'));
                limit.classList.add(setClass('limit'));
                current.textContent = "1";
                limit.innerHTML = this.length.toString();
                // Change value on update
                current.addEventListener('update', () => (current.textContent = (this.index + 1).toString()));
                index.append(current, '/', limit);
            }
            else
                this.slides.forEach((_, key) => {
                    let dot = document.createElement("span");
                    dot.classList.add(setClass('dot'));
                    // On a dot clicked, change current slide
                    dot.onclick = () => (function () {
                        let target = this.slides.filter(a => { var _b; return ((_b = a.dataset) === null || _b === void 0 ? void 0 : _b.id) === key.toString(); })[0], step = this.slides.map((a, b) => a == target ? b : 0).reduce((a, b) => a + b);
                        render.call(this, step - Math.round(this.length / 2) + 1);
                    }).call(this);
                    dot.addEventListener('update', () => dot.classList[this.index === key ? 'add' : 'remove']('current'));
                    index.appendChild(dot);
                });
        }
        // render function
        function render(step = 0) {
            this.index += step;
            // Remove interval and reset time elapsed
            clearInterval(this.interval);
            this.timeElapsed = 0;
            // Index must be between 0 and length
            if (this.index < 0)
                this.index = this.length - 1;
            else if (this.index >= this.length)
                this.index = 0;
            // Scroll and then change order
            let order = getOrder(step);
            content.scroll({
                left: content.clientWidth * (scrollStep + step),
                behavior: 'smooth',
            });
            setTimeout(() => {
                setSlides(order);
                content.scroll({ left: content.clientWidth * scrollStep, behavior: 'auto' });
            }, 600);
            // Toggle index
            index.querySelectorAll('span').forEach(el => el.dispatchEvent(new Event('update')));
            // Reset interval
            this.interval = setInterval(() => arrow_b.click(), this.delay);
        }
        // Arrow events
        function onArrowClick(ev) {
            let arrow = ev.currentTarget;
            render.call(this, Number(arrow.classList.contains('left')) * -2 + 1);
            arrow.blur();
        }
        [arrow_a, arrow_b].forEach(arrow => arrow.onclick = e => onArrowClick.call(this, e));
        // First render
        render.call(this);
    }
}
class RGBtoHSL {
    constructor(r, g, b) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);
        this.target = this;
        this.targetHSL = this.target.hsl();
    }
    clamp(value) {
        if (value > 255) {
            value = 255;
        }
        else if (value < 0) {
            value = 0;
        }
        return value;
    }
    multiply(matrix) {
        let newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]), newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]), newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }
    hueRotate(angle = 0) {
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
    sepia(value = 1) {
        this.multiply([
            0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)
        ]);
    }
    saturate(value = 1) {
        this.multiply([
            0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value,
            0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value,
            0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value
        ]);
    }
    brightness(value = 1) { this.linear(value); }
    contrast(value = 1) { this.linear(value, -(.5 * value) + .5); }
    linear(slope = 1, intercept = 0) {
        this.r = this.clamp(this.r * slope + intercept * 255);
        this.g = this.clamp(this.g * slope + intercept * 255);
        this.b = this.clamp(this.b * slope + intercept * 255);
    }
    invert(value = 1) {
        this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
        this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
        this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
    }
    hsl() {
        let r = this.r / 255, g = this.g / 255, b = this.b / 255, max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max === min)
            h = s = 0;
        else {
            let d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h * 100, s: s * 100, l: l * 100 };
    }
    solve() {
        let result = this.solveNarrow(this.solveWide());
        return this.toString(result.values);
    }
    solveWide() {
        const A = 5, c = 15, a = [60, 180, 18000, 600, 1.2, 1.2];
        let best = { loss: Infinity, values: [] };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            let initial = [50, 20, 3750, 50, 100, 100];
            let result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss)
                best = result;
        }
        return best;
    }
    solveNarrow(wide) {
        const A = wide.loss;
        const c = 2, A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
        return this.spsa(A, a, c, wide.values, 500);
    }
    spsa(A, a, c, values, iters) {
        const alpha = 1, gamma = 1 / 6;
        let best = null, bestLoss = Infinity, deltas = new Array(6), highArgs = new Array(6), lowArgs = new Array(6);
        function fix(value, idx) {
            let max = 100;
            if (idx === 2)
                max = 7500;
            else if (idx === 4 || idx === 5)
                max = 200;
            if (idx === 3) {
                if (value > max)
                    value %= max;
                else if (value < 0)
                    value = max + value % max;
            }
            else if (value < 0)
                value = 0;
            else if (value > max)
                value = max;
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
    loss(filters) {
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
    toString(filters) {
        const fmt = (idx, multiplier = 1) => Math.round(filters[idx] * multiplier);
        return `invert(${fmt(0)}%) ` + `sepia(${fmt(1)}%) `
            + `saturate(${fmt(2)}%) ` + `hue-rotate(${fmt(3, 3.6)}deg) `
            + `brightness(${fmt(4)}%) ` + `contrast(${fmt(5)}%)`;
    }
}
