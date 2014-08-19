Expandable Input – A bootstrap plugin
=====================================

> A Bootstrap plugin to use <{span|div|...} contenteditable> as
  expandable inputs.


Installation
------------

Simplest way to install is using [bower](http://bower.io/):

```
bower install --save bootstrap-expandable-input
```


Usage
-----

```html
<!-- load bootstrap assets -->
<link rel="stylesheet" type="text/css" href="bootstrap.css">
<script src="bootstrap.js"></script>

<!-- load expandable-input assets -->
<link rel="stylesheet" type="text/css" href="bootstrap-expandable-input.css">
<script src="bootstrap-expandable-input.js"></script>

<!-- The behaviour is initialzied on first interaction -->
<p>
  <strong>Author:</strong>
  <span contenteditable name="name" placeholder="Joe Doe"></span> |
  <span contenteditable name="email" placeholder="joe@example.com"></span>
</p>

<p contenteditable placeholder="Write comment"></p>
```

To listen to changes on the inputs

```js
$('[name=email]').on('input', function(event) {
  console.log('Current name is:', $(this).val())
})
```


Notes
-----

- `$.fn.val()` & `$.fn.select()` are being patched to work with the `contenteditable` inputs
- `display: inline` is currently not supported. It gets set to inline-block when initialized.
- no html5 validation or password=type etc is not supported.


Fine Print
----------

The Expandable Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of [Team Hoodie](http://hood.ie/). If you feel like it, please support our work
on Hoodie: [gittip us!](https://www.gittip.com/hoodiehq/).

License: MIT
