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

To pass suggestions for the autocomplete, listen to the `autocomplete:request` event

```js
$('[name=country]').on('autocomplete:request', function(event, query, callback) {
  var suggestions = getSuggestionsArrayFor(query);
  callback(suggestions);
})
```

To react on when a suggestion has been selected, listen to the `autocomplete:select` event.

```js
$('[name=country]').on('autocomplete:select', function(event, selected) {
  console.log('selected item:', selected);
})
```


Fine Print
----------

The Expandable Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of [Team Hoodie](http://hood.ie/). If you feel like it, please support our work
on Hoodie: [gittip us!](https://www.gittip.com/hoodiehq/).

License: MIT
