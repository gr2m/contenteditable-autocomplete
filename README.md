Expandable Input Autocomplete – A bootstrap plugin
==================================================

> Add Autocomplete/Typeahead to contenteditable tag


Installation
------------

Simplest way to install is using [bower](http://bower.io/):

```
bower install --save bootstrap-contenteditable-autocomplete
```

Usage
-----

```html
<!-- load bootstrap assets -->
<link rel="stylesheet" type="text/css" href="bootstrap.css">
<script src="bootstrap.js"></script>

<!-- load contenteditable-autocomplete assets -->
<link rel="stylesheet" type="text/css" href="bootstrap-contenteditable-autocomplete.css">
<script src="bootstrap-contenteditable-autocomplete.js"></script>

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


Fine Print
----------

The Expandable Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of the [Hoodie Community](http://hood.ie/).

License: MIT
