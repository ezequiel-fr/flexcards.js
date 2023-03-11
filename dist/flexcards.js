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
        index.style.setProperty('--theme', "#" + "666");
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
    carousel() {
        const { container, content } = this.components;
        // Get new slides order
        const getOrder = (arr, step = 1) => {
            step = -(step % arr.length);
            return arr.map((_a, b) => arr[b + (arr[b - step] ? -step : Math.sign(step) * (arr.length - Math.abs(step)))]);
        };
        // Set slides
        const setSlides = (slides) => slides.forEach((slide, key) => {
            this.slides[key] = slide;
            content.appendChild(slide);
        });
        // Apply a first order
        let firstStep = -Math.abs(Math.round(this.length / 2 - 1));
        console.log(...getOrder(this.slides, firstStep));
        setSlides(getOrder(this.slides, firstStep));
        content.scroll({ left: content.clientWidth, behavior: "auto" });
        // Set arrows
        let arrow_a = document.createElement("button"), arrow_b = document.createElement("button"), image_a = document.createElement("img"), image_b = document.createElement("img");
        arrow_a.classList.add(setClass('arrow'), 'left');
        arrow_b.classList.add(setClass('arrow'), 'right');
        image_a.classList.add(setClass('carret'));
        image_b.classList.add(setClass('carret'));
        arrow_a.type = "button";
        arrow_b.type = "button";
        arrow_a.style.filter = "opacity(95%)";
        arrow_b.style.filter = "opacity(95%)";
        image_a.alt = "Toggle left";
        image_b.alt = "Toggle right";
        image_a.src = "../assets/icons/carret.svg";
        image_b.src = "../assets/icons/carret.svg";
        arrow_a.appendChild(image_a);
        arrow_b.appendChild(image_b);
        container.insertBefore(arrow_a, content);
        container.appendChild(arrow_b);
        // render function
        function render(step = 0) {
            // Reset time elapsed
            this.timeElapsed = 0;
            const updateContent = () => {
                let order = getOrder(this.slides, step);
                // Scroll and then change order
                content.scroll({ left: content.clientWidth * (1 + step), behavior: 'smooth' });
                setTimeout(() => {
                    setSlides(order);
                    content.scroll({ left: content.clientWidth, behavior: 'auto' });
                }, 550);
            };
            updateContent();
            // Toggle index
            // Set "auto-scroll"
            this.interval = setInterval(() => arrow_b.click(), this.delay);
        }
        // Arrow events
        function onArrowClick(ev) {
            clearInterval(this.interval);
            let arrow = ev.currentTarget, initialIndex = this.index;
            this.index += Number(arrow.classList.contains('left')) * -2 + 1;
            // Index must be between 0 and length
            if (this.index < 0) {
                this.index = this.length - 1;
                initialIndex = this.length;
            }
            else if (this.index >= this.length) {
                this.index = 0;
                initialIndex = -1;
            }
            render.call(this, this.index - initialIndex);
            arrow.blur();
        }
        [arrow_a, arrow_b].forEach(arrow => arrow.onclick = e => onArrowClick.call(this, e));
        // First render
        render.call(this, 0);
    }
}
