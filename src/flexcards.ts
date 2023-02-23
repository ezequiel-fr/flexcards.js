function createElement<E = HTMLElement>(element: keyof HTMLElementTagNameMap) {
    return window.document.createElement(element) as E;
}

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
    private readonly width = 0;
    private readonly height = 0;

    public delay = 6000;
    public "animation-time" = 350;

    protected container: HTMLElement;
    protected articles: NodeListOf<HTMLElement>;

    constructor (element: string) {
        this.container = querySelector(element) as HTMLDivElement;
        this.articles = this.container.querySelectorAll('article');
    }

    private mount() {
        // Create components
        let container = createElement<HTMLDivElement>('div'),
            content = createElement<HTMLDivElement>('div'),
            index = createElement<HTMLDivElement>('div'),
            carret_a = createElement<HTMLButtonElement>('button'),
            carret_b = createElement<HTMLButtonElement>('button'),
            image_a = createElement<HTMLImageElement>('img'),
            image_b = createElement<HTMLImageElement>('img');

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
