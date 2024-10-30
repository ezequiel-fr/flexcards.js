<h1 style="font-size: 3.5rem; text-align: center">flexcards.js</h1>

![Author](https://badgen.net/badge/Author/ezequiel-fr/green)
![License](https://badgen.net/badge/License/TheUnlicense/blue?icon=github)
[![Downloads](https://img.shields.io/npm/dt/flexcardsjs?color=red&label=Downloads)](https://www.npmjs.com/package/flexcardsjs)
[![React downloads](https://img.shields.io/npm/dt/flexcardsjs-react?color=red&label=React%20downloads)](https://www.npmjs.com/package/flexcardsjs-react)

## Summary :
- [Installation & setup](#installation--setup)
    - [HTML5](#html5)
    - [NPM](#npm)w
    - [React](#react)
- [Basic usage](#usage)
    - [Setup](#setup)
    - [Adding options](#adding-options)
- [Functionnalities and options](#functionnalities-and-options)
    - [General options](#general-options)
    - [Carousel](#carousel)
        - [Options](#options)
        - [Functions](#functions)
- [Thanks & Credits](#thanks)


## Installation & setup
### HTML5
#### Download
After downloading the [browser.js](https://unpkg.com/flexcardsjs@3.1.0/build/browser.js) file and [style.css](https://unpkg.com/flexcardsjs@3.1.0/build/style.css),
you can follow the tutorial bellow to use flexcards.js.
<br /> For more informations about the functions used, go to the [usage](#usage) section.

#### Setup
If you downloaded the files, you can include them in your HTML file like this:
```html
<script src="path/to/browser.js"></script>
<link rel="stylesheet" href="path/to/style.css">
```

### NPM
Install the package using the following NPM command:
```bash
npm install flexcardsjs --save
```

Then, you can import the package in your project:
```js
import FlexCards from 'flexcardsjs';
import 'flexcardsjs/build/style.css';
```

### React
**Unavailable for now** (deprecated version remains available).


## Usage
First of all, ensure that you have included the right files in your project.
<br />

### Setup
 - In your HTML file, you can include the following code:
    ```html
    <!-- Your component -->
    <div id="flexcards">
        <!-- Articles are the items to display here -->
        <article>Lorem ipsum</article>
        <article>Dolor sit</article>
        <article>Amet consectetur</article>
    </div>
    ```

 - In your JavaScript file or `<script>` tag, you can simply create a new instance of flexcards.js
 like this:
    ```js
    const carousel = new FlexCards.Carousel('#flexcards', {
        // Options
        // ...
    });
    ```

### Adding options
Check the [options](#functionnalities-and-options) section for more informations about the
available options.\


## Functionnalities and options
Option can be passed as a second argument in each `flexcards.js` instance. Here are the available
options for each instance:

### General options
- **`components`** : `default` will load `article` (`<article>`) elements and `images` will load `<img>` elements.
- **`theme`** : an hexadecimal color to apply as the theme of the flexcards instance.

### Carousel
A simple and customizable JavaScript and CSS carousel designed for smooth transitions and flexible
configuration.

#### Options
 - **`delay`** : Delay in milliseconds before the next slide (default: 6s).
 - **`autoplay`** : Automatically cycle through slides (default: true).
 - **`loop`** : Loop back to the first slide at the end (by default: true).
 - **`displayIndex`** (`none`, `dots`, `numbers`) : Type of index to display at the bottom
 (default: "`none`").
 - **`arrows`** : Show control arrows on each side of the carousel (shown by default).
 - **`arrowSrc`** : Custom image source for arrows (default arrow provided).
 - **`progressBar`** : Display a progress bar at the top (default: false).

#### Functions
 - **`next(n)`** : Go to the next slide. If `n` is provided, go to the `n`th next slide.
 - **`prev(n)`** : Go to the previous slide. If `n` is provided, go to the `n`th previous slide.
 - **`pause()`** : Pause the carousel.
 - **`play()`** : Play the carousel.


## Thanks
### Copyright
This project is under the [MIT License](https://opensource.org/licenses/MIT).\
Please, consider reading the [LICENSE](LICENSE) file for more informations.

### RGBtoHSL
I just customize the code found this
[StackOverflow subject](https://stackoverflow.com/a/42966641/604861). So all credits goes to the
posts on this subject and especially to MultiplyByZer0.
