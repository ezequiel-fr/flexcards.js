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
        this.delay = 6000;
        this["animation-time"] = 350;
        this.container = querySelector(element);
        this.articles = this.container.querySelectorAll('article');
    }
    mount() {
        // Create components
        let container = createElement('div'), content = createElement('div'), index = createElement('div'), carret_a = createElement('button'), carret_b = createElement('button'), image_a = createElement('img'), image_b = createElement('img');
        container.classList.add('container', 'row-center');
        content.classList.add('content', 'd-flex');
        index.classList.add('index', 'row-center');
        carret_a.classList.add('carret', 'left', 'col-center');
        carret_b.classList.add('carret', 'left', 'col-center');
        carret_a.type = "button";
        carret_b.type = "button";
        image_a.src = "../assets/icons/carret.svg";
        image_a.alt = "Toggle left";
        image_b.src = "../assets/icons/carret.svg";
        image_b.alt = "Toggle left";
        // Mount in container
        this.container.classList.add('d-flex', 'column', 'align-center');
        this.container.innerHTML = "";
        this.container.append(container, index);
        carret_a.appendChild(image_a);
        carret_b.appendChild(image_b);
        container.append(carret_a, content, carret_b);
        this.articles.forEach((article, key) => {
            content.appendChild(article);
            index.appendChild(createElement('span'));
            article.setAttribute('data-id', key.toString());
        });
        return {
            container,
            content,
            index,
            leftButton: carret_a,
            rightButton: carret_b,
        };
    }
}
