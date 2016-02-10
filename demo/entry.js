require('bootstrap/dist/css/bootstrap.css')
require('../contenteditable-autocomplete.css')
require('./demo.css')

var jQuery = require('jquery')
var contentedtiableAutocomplete = require('../contenteditable-autocomplete')
var expandableInput = require('expandable-input')

expandableInput(jQuery)
contentedtiableAutocomplete(jQuery)

window.$ = window.jQuery = jQuery
