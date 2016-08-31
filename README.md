# contenteditable-autocomplete

> Add Autocomplete/Typeahead to contenteditable tag

[![Build Status](https://travis-ci.org/gr2m/contenteditable-autocomplete.svg)](https://travis-ci.org/gr2m/contenteditable-autocomplete)
[![Dependency Status](https://david-dm.org/gr2m/contenteditable-autocomplete.svg)](https://david-dm.org/gr2m/contenteditable-autocomplete)
[![devDependency Status](https://david-dm.org/gr2m/contenteditable-autocomplete/dev-status.svg)](https://david-dm.org/gr2m/contenteditable-autocomplete#info=devDependencies)

## Download / Installation

You can download the latest JS & CSS code here:

- https://unpkg.com/contenteditable-autocomplete/dist/contenteditable-autocomplete.js
- https://unpkg.com/contenteditable-autocomplete/dist/contenteditable-autocomplete.css

Or install via [npm](https://www.npmjs.com/)

```
npm install --save contenteditable-autocomplete
```

The JS code can be required with

```js
var jQuery = require('jquery')
var contenteditableAutocomplete = require('contenteditable-autocomplete')

// init
contenteditableAutocomplete(jQuery)
```

The CSS code lives at `node_modules/contenteditable-autocomplete/contenteditable-autocomplete.css`

## Usage

```html
<!-- load jquery -->
<script src="jquery.js"></script>


<!-- load contenteditable-autocomplete assets -->
<link rel="stylesheet" type="text/css" href="contenteditable-autocomplete.css">
<script src="contenteditable-autocomplete.js"></script>

<!-- The behaviour is initialzied on first interaction -->
<p>
  <strong>Country:</strong>
  <span contenteditable name="country" placeholder="set country" data-autocomplete-spy></span> |
</p>

<p>
  <strong>Countries:</strong>
</p>
<p contenteditable name="countries" placeholder="set countries" data-autocomplete-spy data-autocomplete-multiple></p>
```

### Suggestions

To pass suggestions for the autocomplete, listen to the `autocomplete:request` event

```js
$('[name=country]').on('autocomplete:request', function(event, query, callback) {
  var suggestions = getSuggestionsArrayFor(query);
  callback(suggestions);
})
```

Instead of strings, you can also pass objects with the mandatory properties `label` and `value`.
`label` will be shown as suggestions. When selected, `value` will be added to the input.

$('[name=country]').on('autocomplete:request', function(event, query, callback) {
  callback([
    {label: 'Germany (Europe)', value: 'Germany'},
    {label: 'Thailand (Asia)', value: 'Thailand'},
    {label: 'Uruguay (South America)', value: 'Uruguay'}
  ]);
})


### Select event

To react on when a suggestion has been selected, listen to the `autocomplete:select` event.

```js
$('[name=country]').on('autocomplete:select', function(event, selected) {
  console.log('selected item:', selected);
})
```

Selected is always an object with `label` and `value` properties (see above). Additional
properties passed to suggestions will be passed.


## Local Setup

```bash
git clone git@github.com:gr2m/contenteditable-autocomplete.git
cd contenteditable-autocomplete
npm install
```

## Test

You can start a local dev server with

```bash
npm start
```

Run tests with

```bash
npm test
```

While working on the tests, you can start Selenium / Chrome driver
once, and then tests re-run on each save

```bash
npm run test:mocha:watch
```

## Fine Print

The Expandable Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of the [Hoodie Community](http://hood.ie/).

License: MIT
