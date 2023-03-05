function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var arrow = _interopDefault(require('./carret~oTrIHMTb.svg'));

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

var RGBtoHSL = /*#__PURE__*/function () {
  function RGBtoHSL(r, g, b) {
    this.r = this.clamp(r);
    this.g = this.clamp(g);
    this.b = this.clamp(b);
    this.target = this;
    this.targetHSL = this.target.hsl();
  }
  var _proto = RGBtoHSL.prototype;
  _proto.clamp = function clamp(value) {
    if (value > 255) {
      value = 255;
    } else if (value < 0) {
      value = 0;
    }
    return value;
  };
  _proto.multiply = function multiply(matrix) {
    var newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]),
      newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]),
      newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
    this.r = newR;
    this.g = newG;
    this.b = newB;
  };
  _proto.hueRotate = function hueRotate(angle) {
    if (angle === void 0) {
      angle = 0;
    }
    angle = angle / 180 * Math.PI;
    var sin = Math.sin(angle),
      cos = Math.cos(angle);
    this.multiply([.213 + cos * .787 - sin * .213, .715 - cos * .715 - sin * .715, .072 - cos * .072 + sin * .928, .213 - cos * .213 + sin * .143, .715 + cos * .285 + sin * .140, .072 - cos * .072 - sin * .283, .213 - cos * .213 - sin * .787, .715 - cos * .715 + sin * .715, .072 + cos * .928 + sin * .072]);
  };
  _proto.sepia = function sepia(value) {
    if (value === void 0) {
      value = 1;
    }
    this.multiply([0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value), 0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value), 0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)]);
  };
  _proto.saturate = function saturate(value) {
    if (value === void 0) {
      value = 1;
    }
    this.multiply([0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value]);
  };
  _proto.brightness = function brightness(value) {
    if (value === void 0) {
      value = 1;
    }
    this.linear(value);
  };
  _proto.contrast = function contrast(value) {
    if (value === void 0) {
      value = 1;
    }
    this.linear(value, -(.5 * value) + .5);
  };
  _proto.linear = function linear(slope, intercept) {
    if (slope === void 0) {
      slope = 1;
    }
    if (intercept === void 0) {
      intercept = 0;
    }
    this.r = this.clamp(this.r * slope + intercept * 255);
    this.g = this.clamp(this.g * slope + intercept * 255);
    this.b = this.clamp(this.b * slope + intercept * 255);
  };
  _proto.invert = function invert(value) {
    if (value === void 0) {
      value = 1;
    }
    this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
    this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
    this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
  };
  _proto.hsl = function hsl() {
    var r = this.r / 255,
      g = this.g / 255,
      b = this.b / 255,
      max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max === min) h = s = 0;else {
      var d = max - min;
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
  };
  _proto.solve = function solve() {
    var result = this.solveNarrow(this.solveWide());
    return this.toString(result.values);
  };
  _proto.solveWide = function solveWide() {
    var A = 5,
      c = 15,
      a = [60, 180, 18000, 600, 1.2, 1.2];
    var best = {
      loss: Infinity,
      values: []
    };
    for (var i = 0; best.loss > 25 && i < 3; i++) {
      var initial = [50, 20, 3750, 50, 100, 100];
      var result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) best = result;
    }
    return best;
  };
  _proto.solveNarrow = function solveNarrow(wide) {
    var A = wide.loss;
    var c = 2,
      A1 = A + 1;
    var a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa(A, a, c, wide.values, 500);
  };
  _proto.spsa = function spsa(A, a, c, values, iters) {
    var alpha = 1,
      gamma = 1 / 6;
    var best = null,
      bestLoss = Infinity,
      deltas = new Array(6),
      highArgs = new Array(6),
      lowArgs = new Array(6);
    function fix(value, idx) {
      var max = 100;
      if (idx === 2) max = 7500;else if (idx === 4 || idx === 5) max = 200;
      if (idx === 3) {
        if (value > max) value %= max;else if (value < 0) value = max + value % max;
      } else if (value < 0) value = 0;else if (value > max) value = max;
      return value;
    }
    for (var k = 0; k < iters; k++) {
      var ck = c / Math.pow(k + 1, gamma);
      for (var i = 0; i < 6; i++) {
        deltas[i] = Math.random() > .5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }
      var lossDiff = this.loss(highArgs) - this.loss(lowArgs);
      for (var _i = 0; _i < 6; _i++) {
        var g = lossDiff / (2 * ck) * deltas[_i];
        var ak = a[_i] / Math.pow(A + k + 1, alpha);
        values[_i] = fix(values[_i] - ak * g, _i);
      }
      var loss = this.loss(values);
      if (loss < bestLoss) {
        best = values.slice(0);
        bestLoss = loss;
      }
    }
    return {
      values: best || [],
      loss: bestLoss
    };
  };
  _proto.loss = function loss(filters) {
    var color = new RGBtoHSL(0, 0, 0);
    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);
    var colorHSL = color.hsl();
    return Math.abs(color.r - this.target.r) + Math.abs(colorHSL.h - this.targetHSL.h) + Math.abs(color.g - this.target.g) + Math.abs(colorHSL.s - this.targetHSL.s) + Math.abs(color.b - this.target.b) + Math.abs(colorHSL.l - this.targetHSL.l);
  };
  _proto.toString = function toString(filters) {
    var fmt = function fmt(idx, multiplier) {
      if (multiplier === void 0) {
        multiplier = 1;
      }
      return Math.round(filters[idx] * multiplier);
    };
    return "invert(" + fmt(0) + "%) " + ("sepia(" + fmt(1) + "%) ") + ("saturate(" + fmt(2) + "%) ") + ("hue-rotate(" + fmt(3, 3.6) + "deg) ") + ("brightness(" + fmt(4) + "%) ") + ("contrast(" + fmt(5) + "%)");
  };
  return RGBtoHSL;
}();

var _excluded = ["component", "delay", "indexType", "stop", "theme", "timer"],
  _excluded2 = ["component", "delay", "indexType", "stop", "theme", "timer"];
function getTheme(color) {
  color = color.replace('#', '');
  color = color.replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, function (_m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  var rgb = result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0],
    filter = new RGBtoHSL(rgb[0], rgb[1], rgb[2]).solve();
  return {
    rgb: "#" + color,
    filter: filter
  };
}
function setClass() {
  for (var _len = arguments.length, tokens = new Array(_len), _key = 0; _key < _len; _key++) {
    tokens[_key] = arguments[_key];
  }
  var result = tokens.map(function (a) {
    return typeof a === 'string' ? a : "";
  }).join(' ').replace(/  +/g, " ");
  return result.endsWith(" ") ? result.slice(0, -1) : result;
}
var Component = function Component(params) {
  return React.createElement("article", Object.assign({}, params, {
    className: setClass('flexcards__card', params.className)
  }), params.children);
};
var Carousel = function Carousel(_ref) {
  var _ref$component = _ref.component,
    component = _ref$component === void 0 ? 'default' : _ref$component,
    _ref$delay = _ref.delay,
    delay = _ref$delay === void 0 ? 6000 : _ref$delay,
    _ref$indexType = _ref.indexType,
    indexType = _ref$indexType === void 0 ? 'dots' : _ref$indexType,
    _ref$stop = _ref.stop,
    stop = _ref$stop === void 0 ? false : _ref$stop,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? '#666' : _ref$theme,
    _ref$timer = _ref.timer,
    timer = _ref$timer === void 0 ? false : _ref$timer,
    params = _objectWithoutPropertiesLoose(_ref, _excluded);
  var interval = setInterval(function () {
      return void 0;
    }, delay),
    carousel = document.createElement('div'),
    refreshTime = 250,
    timeElapsed = 0,
    index = 0;
  var colors = getTheme(theme);
  var id = Array.from(new Uint8Array(10)).map(function () {
    return "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)][Math.round(Math.random()) ? 'toUpperCase' : 'toLowerCase']();
  }).join('');
  var slides = Array.from(carousel.querySelectorAll(component === 'default' ? 'article' : 'img')),
    length = slides.length;
  var dotClick = function dotClick(key) {
    var count = key - index;
    for (var i = 0; i < Math.abs(count); i++) {
      if (count < 0) carousel.querySelector('.left');else if (count > 0) carousel.querySelector('.right');
    }
  };
  var render = function render(step) {
    if (step === void 0) {
      step = 0;
    }
    var content = carousel.querySelector('.flexcards__content') || document.createElement('div');
    timeElapsed = 0;
    var updateContent = function updateContent() {
      content.querySelectorAll('article').forEach(function (el) {
        el.classList.remove('animate');
        el.remove();
      });
      content.append(slides[(index - 1 < 0 ? length : index) - 1], slides[index], slides[index + 1 >= length ? 0 : index + 1]);
      content.scroll({
        left: content.clientWidth
      });
      slides[index].classList.add('animate');
      content.addEventListener('scroll', onScroll);
      var timer = carousel.querySelector('.flexcards__timer');
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
    if (indexType === 'numbers') {
      var el = carousel.querySelector('.flexcards__index .flexcards__count');
      el && (el.textContent = Number(index + 1).toString());
    } else {
      content.querySelectorAll('.flexcards__index > span').forEach(function (dot, key) {
        return dot.classList[index === key ? 'add' : 'remove']('current');
      });
    }
    interval = setInterval(function () {
      var _carousel$querySelect;
      return (_carousel$querySelect = carousel.querySelector('.flexcards__arrow.right')) === null || _carousel$querySelect === void 0 ? void 0 : _carousel$querySelect.click();
    }, delay);
  };
  var onScroll = function onScroll(e) {
    var _carousel$querySelect2, _carousel$querySelect3;
    var content = e.currentTarget,
      calc = 100 * (content.scrollLeft / content.scrollWidth - 1);
    if (calc >= 5) (_carousel$querySelect2 = carousel.querySelector('.right')) === null || _carousel$querySelect2 === void 0 ? void 0 : _carousel$querySelect2.click();else if (calc <= -5) (_carousel$querySelect3 = carousel.querySelector('.left')) === null || _carousel$querySelect3 === void 0 ? void 0 : _carousel$querySelect3.click();
  };
  var onArrowClick = function onArrowClick(e) {
    clearInterval(interval);
    var arrow = e.currentTarget,
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
  React.useEffect(function () {
    var _carousel$querySelect4, _carousel$querySelect5;
    carousel = document.querySelector('.flexcards__' + id) || document.createElement('div');
    (_carousel$querySelect4 = carousel.querySelector(".flexcards__index")) === null || _carousel$querySelect4 === void 0 ? void 0 : _carousel$querySelect4.style.setProperty('--theme', colors.rgb);
    var timerDisplay = carousel.querySelector(".flexcards__timer");
    if (timer && timerDisplay) {
      var iterations = delay / refreshTime * 2;
      timerDisplay.style.setProperty('--theme', colors.rgb);
      timerDisplay.style.transitionDuration = iterations + "ms";
      setInterval(function () {
        return timerDisplay.style.setProperty('--percentage', (timeElapsed / delay * 200).toString());
      }, iterations * 1e5);
    }
    var adder = delay / refreshTime;
    setInterval(function () {
      return timeElapsed += adder;
    }, adder);
    slides.forEach(function (slide, key) {
      slide.classList.add('flexcards__card');
      if (component === 'images') slide.classList.add('flexcards__image');
      slide.setAttribute('data-id', key.toString());
    });
    stop && clearInterval(interval);
    (_carousel$querySelect5 = carousel.querySelector('.flexcards__content')) === null || _carousel$querySelect5 === void 0 ? void 0 : _carousel$querySelect5.addEventListener('scroll', onScroll);
  });
  return React.createElement("div", Object.assign({}, params, {
    className: setClass('flexcards__wrapper', 'flexcards__' + id, params.className)
  }), React.createElement("div", {
    className: "flexcards__container flexcards__carousel"
  }, timer ? React.createElement("span", {
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
  }, indexType === 'numbers' ? React.createElement(React.Fragment, null, React.createElement("span", {
    className: "flexcards__count"
  }, "1"), React.createElement("span", null, " / "), React.createElement("span", {
    className: "flexcards__limit"
  }, length)) : slides.map(function (_, key) {
    return React.createElement("span", {
      key: key,
      className: "flexcards__dot",
      onClick: function onClick() {
        return dotClick(key);
      }
    });
  })));
};
var AlternateCarousel = function AlternateCarousel(_ref2) {
  var _ref2$component = _ref2.component,
    component = _ref2$component === void 0 ? "default" : _ref2$component,
    _ref2$indexType = _ref2.indexType,
    indexType = _ref2$indexType === void 0 ? 'dots' : _ref2$indexType,
    _ref2$theme = _ref2.theme,
    theme = _ref2$theme === void 0 ? "#666" : _ref2$theme,
    _ref2$timer = _ref2.timer,
    timer = _ref2$timer === void 0 ? false : _ref2$timer,
    params = _objectWithoutPropertiesLoose(_ref2, _excluded2);
  var id = Array.from(new Uint8Array(10)).map(function () {
    return "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)][Math.round(Math.random()) ? 'toUpperCase' : 'toLowerCase']();
  }).join('');
  React.useEffect(function () {
    if (!document.getElementById('flexcardsjs-script')) {
      var script = document.createElement('script'),
        source = "https://theredminetheredmine.github.io";
      script.id = 'flexcardsjs-script';
      script.src = source + "flexcards.js/dist/flexcards.min.js";
      script.setAttribute('data-host', source);
      document.head.appendChild(script);
    }
    setTimeout(function () {
      var flexcards = new FlexCards("." + id, {
        component: component,
        indexType: indexType,
        theme: theme,
        timer: timer
      });
      flexcards.carousel();
    }, 500);
  }, [id]);
  return React.createElement("div", Object.assign({}, params, {
    className: setClass(id, params.className)
  }), params.children);
};
var index = {
  Carousel: Carousel
};

exports.AlternateCarousel = AlternateCarousel;
exports.Carousel = Carousel;
exports.Component = Component;
exports.default = index;
//# sourceMappingURL=index.js.map
