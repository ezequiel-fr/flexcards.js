# `flexcards.js`
![Author](https://badgen.net/badge/Author/TheRedMine/green)
![License](https://badgen.net/badge/License/TheUnlicense/blue?icon=github)

## Summary :
- [Usage](#usage)
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
After downloading the [flexcards.js](./dist/flexcards.min.js) file, you can follow the tutorial
bellow to use flexcards.js.
<br /> For more informations about the functions used, go to [function](#functions) category.

### In HTML
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

### Adding parameters
Check the [parameters](#parameters) list to get more informations about.\
In HTML with the `<script>` tag or in JavaScript :
```js
const flexcards = new FlexCards("#flexards");

// Example with the carousel :
flexcards.carousel({ theme: '#f00' });
```

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
