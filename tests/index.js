"use strict";
const flexcards = document.querySelector('div.flexcards') || document.createElement('div');
const carret = flexcards.querySelectorAll('.carret');
const articles = flexcards.querySelectorAll('article');
const indexDisplay = flexcards.querySelector('.index');
const content = flexcards.querySelector('.content');
var delay = 6e3, index = 0, scrollInterval = 0;
function updateArticles(step, max) {
    const changeContent = function () {
        content.querySelectorAll('article').forEach(article => {
            article.classList.remove('animate');
            article.remove();
        });
        content.append(articles.item((index - 1 < 0 ? max : index) - 1), articles.item(index), articles.item(index + 1 >= max ? 0 : index + 1));
        content.scroll({ left: content.clientWidth });
        console.log([index, articles, articles[index]]);
        articles[index].classList.add('animate');
    };
    if (Math.abs(step)) {
        content.scroll({ left: content.clientWidth * (1 + step), behavior: 'smooth' });
        setTimeout(changeContent, 550);
    }
    else
        changeContent();
    indexDisplay.querySelectorAll('span').forEach((a, b) => a.classList[index === b ? 'remove' : 'add']('current'));
    scrollInterval = setInterval(() => carret === null || carret === void 0 ? void 0 : carret[1].click(), delay);
}
if (!Object.prototype.hasOwnProperty.call(flexcards === null || flexcards === void 0 ? void 0 : flexcards.dataset, 'length')) {
    flexcards.setAttribute('data-length', articles.length.toString());
    const min = 0, max = Number(flexcards.dataset.length);
    indexDisplay.innerHTML = "";
    articles.forEach(() => indexDisplay.append(document.createElement('span')));
    carret.forEach(el => el.onclick = function () {
        clearInterval(scrollInterval);
        let initialIndex = index;
        index += Number(el.classList.contains('left')) * -2 + 1;
        if (index < min) {
            index = max - 1;
            initialIndex = max;
        }
        else if (index >= max) {
            index = min;
            initialIndex = -1;
        }
        updateArticles(index - initialIndex, max);
    });
    updateArticles(0, max);
}
