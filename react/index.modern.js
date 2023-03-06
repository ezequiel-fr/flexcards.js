import React from 'react';
import arrow from './carret~oTrIHMTb.svg';

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
    } else if (value < 0) {
      value = 0;
    }
    return value;
  }
  multiply(matrix) {
    let newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]),
      newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]),
      newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
    this.r = newR;
    this.g = newG;
    this.b = newB;
  }
  hueRotate(angle = 0) {
    angle = angle / 180 * Math.PI;
    let sin = Math.sin(angle),
      cos = Math.cos(angle);
    this.multiply([.213 + cos * .787 - sin * .213, .715 - cos * .715 - sin * .715, .072 - cos * .072 + sin * .928, .213 - cos * .213 + sin * .143, .715 + cos * .285 + sin * .140, .072 - cos * .072 - sin * .283, .213 - cos * .213 - sin * .787, .715 - cos * .715 + sin * .715, .072 + cos * .928 + sin * .072]);
  }
  sepia(value = 1) {
    this.multiply([0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value), 0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value), 0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)]);
  }
  saturate(value = 1) {
    this.multiply([0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value]);
  }
  brightness(value = 1) {
    this.linear(value);
  }
  contrast(value = 1) {
    this.linear(value, -(.5 * value) + .5);
  }
  linear(slope = 1, intercept = 0) {
    this.r = this.clamp(this.r * slope + intercept * 255);
    this.g = this.clamp(this.g * slope + intercept * 255);
    this.b = this.clamp(this.b * slope + intercept * 255);
  }
  invert(value = 1) {
    this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
    this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
    this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
  }
  hsl() {
    let r = this.r / 255,
      g = this.g / 255,
      b = this.b / 255,
      max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max === min) h = s = 0;else {
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
    return {
      h: h * 100,
      s: s * 100,
      l: l * 100
    };
  }
  solve() {
    let result = this.solveNarrow(this.solveWide());
    return this.toString(result.values);
  }
  solveWide() {
    const A = 5,
      c = 15,
      a = [60, 180, 18000, 600, 1.2, 1.2];
    let best = {
      loss: Infinity,
      values: []
    };
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      let initial = [50, 20, 3750, 50, 100, 100];
      let result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) best = result;
    }
    return best;
  }
  solveNarrow(wide) {
    const A = wide.loss;
    const c = 2,
      A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa(A, a, c, wide.values, 500);
  }
  spsa(A, a, c, values, iters) {
    const alpha = 1,
      gamma = 1 / 6;
    let best = null,
      bestLoss = Infinity,
      deltas = new Array(6),
      highArgs = new Array(6),
      lowArgs = new Array(6);
    function fix(value, idx) {
      let max = 100;
      if (idx === 2) max = 7500;else if (idx === 4 || idx === 5) max = 200;
      if (idx === 3) {
        if (value > max) value %= max;else if (value < 0) value = max + value % max;
      } else if (value < 0) value = 0;else if (value > max) value = max;
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
    return {
      values: best || [],
      loss: bestLoss
    };
  }
  loss(filters) {
    let color = new RGBtoHSL(0, 0, 0);
    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);
    let colorHSL = color.hsl();
    return Math.abs(color.r - this.target.r) + Math.abs(colorHSL.h - this.targetHSL.h) + Math.abs(color.g - this.target.g) + Math.abs(colorHSL.s - this.targetHSL.s) + Math.abs(color.b - this.target.b) + Math.abs(colorHSL.l - this.targetHSL.l);
  }
  toString(filters) {
    const fmt = (idx, multiplier = 1) => Math.round(filters[idx] * multiplier);
    return `invert(${fmt(0)}%) ` + `sepia(${fmt(1)}%) ` + `saturate(${fmt(2)}%) ` + `hue-rotate(${fmt(3, 3.6)}deg) ` + `brightness(${fmt(4)}%) ` + `contrast(${fmt(5)}%)`;
  }
}

function getTheme(color) {
  color = color.replace('#', '');
  color = color.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_m, r, g, b) => r + r + g + g + b + b);
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  let rgb = result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0],
    filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();
  return {
    rgb: "#" + color,
    filter
  };
}
function setClass(...tokens) {
  let result = tokens.map(a => typeof a === 'string' ? a : "").join(' ').replace(/  +/g, " ");
  return result.endsWith(" ") ? result.slice(0, -1) : result;
}
const Component = params => React.createElement("article", Object.assign({}, params, {
  className: setClass('flexcards__card', params.className)
}), params.children);
const Carousel = ({
  component: _component = 'default',
  delay: _delay = 6000,
  indexType: _indexType = 'dots',
  stop: _stop = false,
  theme: _theme = '#666',
  timer: _timer = false,
  ...params
}) => {
  var interval = setInterval(() => void 0, _delay),
    carousel = document.createElement('div'),
    refreshTime = 250,
    timeElapsed = 0,
    index = 0;
  const colors = getTheme(_theme);
  const id = Array.from(new Uint8Array(10)).map(() => "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)][Math.round(Math.random()) ? 'toUpperCase' : 'toLowerCase']()).join('');
  var slides = Array.from(carousel.querySelectorAll(_component === 'default' ? 'article' : 'img')),
    {
      length
    } = slides;
  const dotClick = key => {
    let count = key - index;
    for (let i = 0; i < Math.abs(count); i++) {
      if (count < 0) carousel.querySelector('.left');else if (count > 0) carousel.querySelector('.right');
    }
  };
  const render = (step = 0) => {
    let content = carousel.querySelector('.flexcards__content') || document.createElement('div');
    timeElapsed = 0;
    const updateContent = () => {
      content.querySelectorAll('article').forEach(el => {
        el.classList.remove('animate');
        el.remove();
      });
      content.append(slides[(index - 1 < 0 ? length : index) - 1], slides[index], slides[index + 1 >= length ? 0 : index + 1]);
      content.scroll({
        left: content.clientWidth
      });
      slides[index].classList.add('animate');
      content.addEventListener('scroll', onScroll);
      let timer = carousel.querySelector('.flexcards__timer');
      timer && timer.style.setProperty('--percentage', '0');
    };
    if (Math.abs(step)) {
      content.removeEventListener('scroll', onScroll);
      content.scroll({
        left: content.clientWidth * (1 + step),
        behavior: 'smooth'
      });
      setTimeout(updateContent, 550);
    } else updateContent();
    if (_indexType === 'numbers') {
      let el = carousel.querySelector('.flexcards__index .flexcards__count');
      el && (el.textContent = Number(index + 1).toString());
    } else {
      content.querySelectorAll('.flexcards__index > span').forEach((dot, key) => dot.classList[index === key ? 'add' : 'remove']('current'));
    }
    interval = setInterval(() => {
      var _carousel$querySelect;
      return (_carousel$querySelect = carousel.querySelector('.flexcards__arrow.right')) === null || _carousel$querySelect === void 0 ? void 0 : _carousel$querySelect.click();
    }, _delay);
  };
  const onScroll = e => {
    var _carousel$querySelect2, _carousel$querySelect3;
    let content = e.currentTarget,
      calc = 100 * (content.scrollLeft / content.scrollWidth - 1);
    if (calc >= 5) (_carousel$querySelect2 = carousel.querySelector('.right')) === null || _carousel$querySelect2 === void 0 ? void 0 : _carousel$querySelect2.click();else if (calc <= -5) (_carousel$querySelect3 = carousel.querySelector('.left')) === null || _carousel$querySelect3 === void 0 ? void 0 : _carousel$querySelect3.click();
  };
  const onArrowClick = e => {
    clearInterval(interval);
    let arrow = e.currentTarget,
      initialIndex = index;
    index += Number(arrow.classList.contains('left')) * -2 + 1;
    if (index < 0) {
      index = length - 1;
      initialIndex = length;
    } else if (index >= length) {
      index = 0;
      initialIndex = -1;
    }
    render(index - initialIndex);
    arrow.blur();
  };
  React.useEffect(() => {
    var _carousel$querySelect4, _carousel$querySelect5;
    carousel = document.querySelector('.flexcards__' + id) || document.createElement('div');
    (_carousel$querySelect4 = carousel.querySelector(".flexcards__index")) === null || _carousel$querySelect4 === void 0 ? void 0 : _carousel$querySelect4.style.setProperty('--theme', colors.rgb);
    const timerDisplay = carousel.querySelector(".flexcards__timer");
    if (_timer && timerDisplay) {
      let iterations = _delay / refreshTime * 2;
      timerDisplay.style.setProperty('--theme', colors.rgb);
      timerDisplay.style.transitionDuration = `${iterations}ms`;
      setInterval(() => timerDisplay.style.setProperty('--percentage', (timeElapsed / _delay * 200).toString()), iterations * 1e5);
    }
    let adder = _delay / refreshTime;
    setInterval(() => timeElapsed += adder, adder);
    slides.forEach((slide, key) => {
      slide.classList.add('flexcards__card');
      if (_component === 'images') slide.classList.add('flexcards__image');
      slide.setAttribute('data-id', key.toString());
    });
    _stop && clearInterval(interval);
    (_carousel$querySelect5 = carousel.querySelector('.flexcards__content')) === null || _carousel$querySelect5 === void 0 ? void 0 : _carousel$querySelect5.addEventListener('scroll', onScroll);
  });
  return React.createElement("div", Object.assign({}, params, {
    className: setClass('flexcards__wrapper', 'flexcards__' + id, params.className)
  }), React.createElement("div", {
    className: "flexcards__container flexcards__carousel"
  }, _timer ? React.createElement("span", {
    className: "flexcards__timer"
  }) : "", React.createElement("button", {
    className: "flexcards__arrow left",
    type: "button",
    style: {
      filter: colors.filter
    },
    onClick: onArrowClick
  }, React.createElement("img", {
    className: "flexcards__carret",
    src: arrow,
    alt: "Toggle left"
  })), React.createElement("div", {
    className: "flexcards__content"
  }, params.children), React.createElement("button", {
    className: "flexcards__arrow right",
    type: "button",
    style: {
      filter: colors.filter
    },
    onClick: onArrowClick
  }, React.createElement("img", {
    className: "flexcards__carret",
    src: arrow,
    alt: "Toggle right"
  }))), React.createElement("div", {
    className: "flexcards__index"
  }, _indexType === 'numbers' ? React.createElement(React.Fragment, null, React.createElement("span", {
    className: "flexcards__count"
  }, "1"), React.createElement("span", null, " / "), React.createElement("span", {
    className: "flexcards__limit"
  }, length)) : slides.map((_, key) => React.createElement("span", {
    key: key,
    className: "flexcards__dot",
    onClick: () => dotClick(key)
  }))));
};
const AlternateCarousel = ({
  component: _component2 = "default",
  delay: _delay2 = 6000,
  indexType: _indexType2 = 'dots',
  stop: _stop2 = false,
  theme: _theme2 = "#666",
  timer: _timer2 = false,
  ...params
}) => {
  const id = Array.from(new Uint8Array(10)).map(() => "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)][Math.round(Math.random()) ? 'toUpperCase' : 'toLowerCase']()).join('');
  React.useEffect(() => {
    if (!document.getElementById('flexcardsjs-script')) {
      let script = document.createElement('script'),
        source = "https://theredminetheredmine.github.io";
      script.id = 'flexcardsjs-script';
      script.src = source + "flexcards.js/dist/flexcards.min.js";
      script.setAttribute('data-host', source);
      document.head.appendChild(script);
    }
    setTimeout(function () {
      const flexcards = new FlexCards("." + id, {
        component: _component2,
        indexType: _indexType2,
        theme: _theme2,
        timer: _timer2
      });
      flexcards.carousel();
    }, 500);
  }, [id]);
  return React.createElement("div", Object.assign({}, params, {
    className: setClass(id, params.className)
  }), params.children);
};
var index = {
  Carousel
};

export default index;
export { AlternateCarousel, Carousel, Component };
//# sourceMappingURL=index.modern.js.map
