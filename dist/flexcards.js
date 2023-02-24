"use strict";
function createElement(element) {
    return window.document.createElement(element);
}
function querySelector(element, defaultElement = "div") {
    try {
        let el = document.querySelector(element);
        if (el)
            return el;
        else
            throw '';
    }
    catch (err) {
        return createElement(defaultElement);
    }
}
class FlexCards {
    constructor(element) {
        this.width = 0;
        this.height = 0;
        this["animation-time"] = 550;
        this.delay = 6000;
        this.index = 0;
        this.components = Object();
        this.interval = 0;
        this.container = querySelector(element);
        this.articles = this.container.querySelectorAll('article');
        this.length = Number(this.articles.length);
    }
    mount() {
        // Create components
        let container = createElement('div'), content = createElement('div'), index = createElement('div'), arrow_a = createElement('button'), arrow_b = createElement('button'), image_a = createElement('img'), image_b = createElement('img');
        container.classList.add('flexcards__container');
        content.classList.add('flexcards__content');
        index.classList.add('flexcards__index');
        arrow_a.classList.add('flexcards__arrow', 'left');
        arrow_b.classList.add('flexcards__arrow', 'right');
        image_a.classList.add('flexcards__carret');
        image_b.classList.add('flexcards__carret');
        arrow_a.type = "button";
        arrow_b.type = "button";
        image_a.src = "../assets/icons/carret.svg";
        image_a.alt = "Toggle left";
        image_b.src = "../assets/icons/carret.svg";
        image_b.alt = "Toggle right";
        // Mount in container
        this.container.classList.add("flexcards__wrapper");
        this.container.innerHTML = "";
        this.container.append(container, index);
        arrow_a.appendChild(image_a);
        arrow_b.appendChild(image_b);
        container.append(arrow_a, content, arrow_b);
        this.articles.forEach((article, key) => {
            let circle = createElement('span');
            circle.classList.add('flexcards__point');
            if (!key)
                circle.classList.add('current');
            index.appendChild(circle);
            content.appendChild(article);
            article.classList.add('flexcards__card');
            article.setAttribute('data-id', key.toString());
        });
        return {
            container, content, index,
            arrows: { left: arrow_a, right: arrow_b },
        };
    }
    carousel() {
        // Mount components
        const components = this.mount();
        this.container.classList.add('flexcards__carousel');
        function render(step = 0) {
            const updateContent = () => {
                // put the animation in this function
                components.content.querySelectorAll('article').forEach(el => {
                    el.classList.remove('animate');
                    el.remove();
                });
                components.content.append(this.articles.item((this.index - 1 < 0 ? this.length : this.index) - 1), this.articles.item(this.index), this.articles.item(this.index + 1 >= this.length ? 0 : this.index + 1));
                components.content.scroll({ left: components.content.clientWidth });
                this.articles[this.index].classList.add('animate');
            };
            if (Math.abs(step)) { // If step != 0 (have to scroll)
                components.content.scroll({
                    left: components.content.clientWidth * (1 + step),
                    behavior: 'smooth',
                });
                setTimeout(updateContent, this["animation-time"]);
            }
            else
                updateContent();
            // Toggle index
            components.index.querySelectorAll('span').forEach((point, key) => {
                point.classList[this.index === key ? 'add' : 'remove']('current');
            });
            // Re-set "auto-scroll"
            this.interval = setInterval(() => components.arrows.right.click(), this.delay);
        }
        function onClick(ev) {
            clearInterval(this.interval);
            let arrow = ev.currentTarget;
            let initialIndex = this.index;
            this.index += Number(arrow.classList.contains('left')) * -2 + 1;
            // Check if index is a num between 0 and length
            if (this.index < 0) {
                this.index = this.length - 1;
                initialIndex = this.length;
            }
            else if (this.index >= this.length) {
                this.index = 0;
                initialIndex = -1;
            }
            // And then render the result
            render.call(this, this.index - initialIndex);
            arrow.blur();
        }
        // Apply onClick event
        [components.arrows.left, components.arrows.right].forEach(arrow => arrow.onclick = e => onClick.call(this, e));
        this.components = components;
        render.call(this);
    }
}
