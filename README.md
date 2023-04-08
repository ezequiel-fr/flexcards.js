<h1 style="font-size: 3.5rem; text-align: center">flexcards.js</h1>

![Author](https://badgen.net/badge/Author/TheRedMine/green)
![License](https://badgen.net/badge/License/TheUnlicense/blue?icon=github)
[![Downloads](https://img.shields.io/npm/dt/flexcardsjs?color=red&label=Downloads)](https://www.npmjs.com/package/flexcardsjs)
[![React downloads](https://img.shields.io/npm/dt/flexcardsjs-react?color=red&label=React%20downloads)](https://www.npmjs.com/package/flexcardsjs-react)

## Summary :
- [Usage](#usage)
    * [HTML5](#html5)
        * [Download](#download)
        * [Setting up a new instance](#setup)
        * [Adding parameters](#adding-parameters)
    * [React](#react)
        * [Installation](#installation)
        * [Setup and parameters](#react-setup-and-parameters)
        * [Components](#react-components)
- [Functions and demo](#functions)
- [Variables](#variables)
- [Functions parameters](#parameters)
- [Thanks](#thanks)

## Functions
- Controllers :
    - `pause` : Stops all animations.
    - `play` : Resume stopped animations.
- Sliders :
    - `carousel` - A simple
    [carousel](https://theredminetheredmine.github.io/flexcards.js/pages/carousel.html)

Demo and documentation available
[here](https://theredminetheredmine.github.io/flexcards.js/website/).

## Variables
Here, the liste of all variables returned by the creation of a new flexcards.js instance :
- `components` : An object containing all components used by the instance called.
- `container` : The HTMLElement used by the flexcards.js instance.
- `delay` : The delay used between every changes.
- `index` : The index of the current slide showed.
- `length` : Count of all slides.
- `playing` : A boolean returning the current playing state.
- `refresh-time` : An index representing the refresh the instance made. The more greater the index,
the more number of refresh.
- `slides` : An array with all the slides.
- `timeElapsed` : Time elapsed before last slide change.

## Usage
<!-- HTML5 usage -->
### HTML5
#### Download
After downloading the [flexcards.js](./dist/flexcards.min.js) file, you can follow the tutorial
bellow to use flexcards.js.
<br /> For more informations about the functions used, go to [function](#functions) category.
If you don't want to download, you can use the UNPKG link :
```
https://unpkg.com/flexcardsjs@latest/index.min.js
```

#### Setup
- In your HTML file, just put the link to the JS file :
```html
<!-- In the header -->
<script src="./flexcards.min.js"></script>

<!-- Your component -->
<div id="flexcards">
    <!-- Articles are the items to display -->
    <article>Lorem ipsum</article>
    <article>Dolor sit</article>
    <article>Amet consectetur</article>
</div>
```
- And in your JavaScript `app.js` or your `<script>` tag you can simply create a new instance of
flexcards.js like the following example :
```js
const flexcards = new FlexCards("#flexcards"); // your JS selector

// Then chose what you want to display with flexcards.js
flexcards.carousel(); // e.g. carousel
```

#### Adding parameters
Check the [parameters](#parameters) list to get more informations about.\
In HTML with the `<script>` tag or in JavaScript :
```js
const flexcards = new FlexCards("#flexards");

// Example with the carousel :
flexcards.carousel({ theme: '#f00' });
```

<!-- React usage -->
### React
#### Installation
Run this npm command in your command line tool in a React project. Then you can start using this
package thanks to the example bellow.
```bash
$ npm install --save flexcardsjs-react
```
#### React setup and parameters
1. Before anything, you must import the components of the package, like this :
```js
import FlexCards from 'flexcards-react';
// or
import { Component } from 'flexcards-react';
```
2. Usage of components :\
Only custom elements comming from the FlexCards package an be used into the flexcards.js instance
you want use.
```jsx
const App = () => (
    <Carousel theme="#f56" delay={7500}>
        <Component>
            <h2>Some title</h2>
            Lorem ipsum dolor sit amet consectetur...
        </Component>

        <ImageComponent src="http://example.org/image.png">
    </Carousel>
);
```
#### React components
- `Carousel` : An amazing and well powered carousel.\
The attributes which can be added are the same of those in the [parameters section](#parameters).
- `Component` : A custom component wherever you can put what you want into (basically, it's an
`article`).
- `ImageComponent` : A slide with only one image

## Parameters
Parameters can be added in JSON format in the function called thanks to the flexcards.js instance.
Here you'll found, the list of all the parameters and the values you can put. To see how it works
to used the parameters, check [this](#adding-parameters) link.

- `arrowUrl` : if a string is provided, will use the path of the image to use.

- `colorized` : default `true`, apply a filter to the arrow (work better on black images) to have
a color that matches the theme. To see how the [RGBtoHSL](#rgbtohsl) object work to apply a filter
converting an RGB color provided into an HSL color, click on the link in the [thanks](#thanks)
section.

- `component` : `default` will use the `article` tags and `images` will use `<img>` tags. This
parameter is an **exception** and must be added next the selector (JSON Format) when the new
instance is created.

- `indexType` \<dots | numbers | undefined\> : `dots` by default will display some dots at the
bottom of the box that can be used to navigate. `numbers` will display a classic index with the
current slide number. If any of these parameter are defined, there will be nothing.

- `theme` : An hexadecimal color code (like in CSS) of 3 or 6 digits that will be applied to the
components provided by flexcards.js (default: #444).

- `timer` : by default to `true`, this attribute will indicate wether a progress bar should be
displayed at the top of the flexcards.js instance or not.

## Thanks
### RGBtoHSL
I just customize the code found this
[StackOverflow subject](https://stackoverflow.com/a/42966641/604861). So all credits goes to the
posts on this subject and especially to MultiplyByZer0.
