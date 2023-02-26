# `flexcards.js`
![Author](https://badgen.net/badge/Author/TheRedMine/green)
![License](https://badgen.net/badge/License/TheUnlicense/blue?icon=github)

## Summary :
- [Usage](#usage)
- [Functions](#functions)
- [Functions parameters](#parameters)

## Functions
- Sliders :
    - `carousel` - A simple JavaScript Carousel

## Usage
After downloading the `flexcards.js` file, you can follow the tutorial bellow to use flexcards.js.
<br /> For more informations about the functions used, go to [function](#functions) category.

### In HTML
- In your HTML file, just put the link to the JS file :
```html
<!-- In the header -->
<script src="flexcards.js"></script>

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
Parameters can be added in JSON format in the function called by the flexcards.js instance. Here
you'll found, the list of all the parameters and the values you can put. To see how it works to
used the parameters, check [this](#adding-parameters) link.
- `component` : `default` will use the `article` tags and `images` will use `<img>` tags.
- `indexType` : `points` by default will display some carret points at the bottom of the box and
`number` will display the current page number.
- `theme` : An hexadecimal color code (like in CSS) of 3 or 6 digits that will be applied to the
components provided by flexcards.js (default: #666).
