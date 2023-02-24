# `flexcards.js`
![License](https://badgen.net/badge/License/TheUnlicense/blue?icon=github)

## Summary :
- [Usage](#usage)
- [Functions](#functions)

## Functions
- Sliders :
    - `carousel` - A simple JavaScript Carousel

## Usage
After downloading the `flexcards.js` file, you can follow the tutorial bellow to use flexcards.js. <br />
For more informations about the functions used, go to [function](#functions) category.

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
