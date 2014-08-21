(function ($) {
  'use strict';

  // AUTOCOMPLETE CLASS DEFINITION
  // =============================

  //
  var ContenteditableAutocomplete = function (el) {
    var $container, $input, $suggestions;
    var currentValue, currentValues, currentSuggestions;

    // multiple words?
    var isMultiple;

    var KEY = {
      UP: 38,
      DOWN: 40,
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      COMMA: 188
    };

    // 1. cache elements for performance reasons and
    // 2. setup event bindings
    function initialize() {
      $input = $(el);
      $container = $('<' + el.nodeName + ' data-autocomplete/>');
      $suggestions = $('<div class="suggestions">').appendTo($container);
      $suggestions.append('<div>Suggestion 1</div><div>Suggestion 2</div><div>Suggestion 3</div>');
      $suggestions.hide();

      isMultiple = $input.is('[data-autocomplete-multiple]');

      $input.on('focus', handleFocus);
      $input.on('input', handleInput);
      $input.on('keydown', handleKeydown);
      $input.on('blur', handleBlur);
      $suggestions.on('mousedown touchstart', '> div', handleSuggestionClick);

      // wrap input into container. Use setTimeout to prevent
      // blur event to be triggered before focus. Yeah it's odd.
      // And as if that wouldn't be enough, the input looses focus
      // when wrapped by $container, so we have to re-set the cursor
      // position manually
      setTimeout(function() {
        var cursorPosition = getCaretCharacterOffsetWithin($input[0]);
        $input.after($container).appendTo($container);
        $input.focus();
        setCursorAt(cursorPosition);
      });
    }


    // Event handlers
    // --------------

    //
    function handleFocus () {
      currentValue = $input.text();
      if (isMultiple) addTrailingComma();
    }
    //
    function handleInput ( /*event*/ ) {
      var newValue = $input.text();
      var query;

      if (! newValue.trim()) {
        $suggestions.hide();
        currentValue = newValue;
        return;
      }

      if (currentValue !== newValue) {
        currentValue = newValue;

        if (isMultiple) {
          query = getCurrentQuery();
        } else {
          query = newValue;
        }

        $input.trigger('autocomplete:request', [query, handleNewSuggestions]);
      }
    }

    //
    // handling of navigation through or selecting one of the suggestions
    //
    function handleKeydown (event) {

      if (! $suggestions.is(':visible') || $suggestions.find('div').length === 0) {
        return;
      }

      switch(event.keyCode) {

        case KEY.UP:
          event.preventDefault();
          highlightPreviousSuggestion();
          return;

        case KEY.DOWN:
          event.preventDefault();
          highlightNextSuggestion();
          return;


        case isMultiple && KEY.COMMA:
        case KEY.RETURN:
        case KEY.TAB:
          selectHighlightedSuggestion();


          $suggestions.hide();

          // do not cancel event on TAB
          if (event.keyCode === KEY.TAB) return;

          event.preventDefault();
          return;

        case KEY.ESC:
          $suggestions.hide();
          return;
      }
    }

    //
    function handleBlur (/*event*/) {
      $suggestions.hide();

      if (isMultiple) removeTrailingComma();
    }

    //
    function handleSuggestionClick (event) {
      event.preventDefault();
      event.stopPropagation();

      selectSuggestionByElement( $(event.currentTarget) );
      $suggestions.hide();
    }


    // Internal Methods
    // ----------------

    //http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    var regexEscapeLatters = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    var regexTrailingComma = /[,\s]*$/;
    var regexSplitWordsWithWhitespace = /\s*,\s*/;


    //
    function handleNewSuggestions (suggestions) {
      var html = '';
      var search = currentValue.replace(regexEscapeLatters, '\\$&');
      var regex = new RegExp('('+search+')', 'i');

      currentValues = currentValue.trim().split(regexSplitWordsWithWhitespace);
      currentSuggestions = suggestions.map( normalizeSuggestion ).filter(newSuggestionsOnly);

      if (currentSuggestions.length === 0) {
        $suggestions.hide();
        return;
      }

      currentSuggestions.forEach(function(suggestion, index) {
        var label = suggestion.label;
        var highlight = (index === 0) ? ' class="highlight"' : '';

        if (! label) return;

        label = htmlEscape(label);

        // select first result per default
        html += '<div' + highlight + '>';
        html += label.replace(regex, '<strong>$1</strong>');
        html += '</div>';
      });
      $suggestions.html(html).show();
    }

    //
    function newSuggestionsOnly (suggestion) {
      if (! suggestion) return;
      return currentValues.indexOf(suggestion.value) === -1;
    }

    //
    function normalizeSuggestion (suggestion) {
      if (! suggestion) return;
      if (typeof suggestion === 'string') {
        return {
          label: suggestion,
          value: suggestion
        };
      }

      return suggestion;
    }

    //
    function highlightNextSuggestion() {
      var $highlighted = $suggestions.find('.highlight');
      var $next = $highlighted.next();

      if (! $next.length) return;

      $highlighted.removeClass('highlight');
      $next.addClass('highlight');
    }
    //
    function highlightPreviousSuggestion() {
      var $highlighted = $suggestions.find('.highlight');
      var $prev = $highlighted.prev();

      if (! $prev.length) return;

      $highlighted.removeClass('highlight');
      $prev.addClass('highlight');
    }

    //
    function selectHighlightedSuggestion() {
      var $highlighted = $suggestions.find('.highlight');
      selectSuggestionByElement($highlighted);
    }

    //
    function selectSuggestionByElement($element) {
      var selected = currentSuggestions[ $element.index() ];
      var value = selected.value;
      if (isMultiple) {
        replaceCurrentWordWith(value);
      } else {
        $input.text(value).focus();
        setCursorAt(value.length);
      }

      $input.trigger('autocomplete:select', [selected]);
    }

    function setCursorAt (position) {
      var range = document.createRange();
      var sel = window.getSelection();
      var textNode = $input[0].childNodes.length ? $input[0].childNodes[0] : $input[0];
      position = Math.min(textNode.length, position);
      range.setStart(textNode, position);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    //
    // to find out what the current word is, we get the current
    // position of the cursor and go through word by word until
    // the total lenght is bigger than the cursor position
    //
    var splitWordsRegex = /,/;
    function getCurrentQuery () {
      var cursorAt = getCaretCharacterOffsetWithin($input[0]);
      var charCount = 0;
      var words = currentValue.split(splitWordsRegex);
      var word;

      for (var i = 0; i < words.length; i++) {
        word = words[i];

        // if we are in the current word, we return all characters
        // between the beginning of the current word and the cursor
        // as query
        if (charCount + word.length >= cursorAt) {
          return currentValue.substring(charCount, cursorAt).trim();
        }
        charCount += word.length + 1; // add 1 for the ,
      }

      // we should not get here
      console.log('getCurrentQuery: Could not find query!');
    }

    //
    function replaceCurrentWordWith (newWord) {
      var cursorAt = getCaretCharacterOffsetWithin($input[0]);
      var charCount = 0;
      var words = currentValue.split(splitWordsRegex);
      var word;
      var beforeQuery;
      var afterQuery;

      for (var i = 0; i < words.length; i++) {
        word = words[i];

        // if we are in the current word, we replace all characters
        // between the beginning of the current word and the cursor
        // with the newly selected word and set the cursor to the end
        if (charCount + word.length >= cursorAt) {
          beforeQuery = currentValue.substring(0, charCount).trim();
          afterQuery = currentValue.substring(cursorAt);
          $input.html(htmlEscape(beforeQuery + ' ' + newWord) + ',&nbsp;' + htmlEscape(afterQuery));
          setCursorAt( (beforeQuery + ' ' + newWord + ', ').length );
          return;
        }
        charCount += word.length + 1; // add 1 for the ,
      }

      // we should not get here
      console.log('replaceCurrentWordWith: Could not find word, returning last');
    }

    // http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
    // also: http://stackoverflow.com/questions/22935320/uncaught-indexsizeerror-failed-to-execute-getrangeat-on-selection-0-is-not
    function getCaretCharacterOffsetWithin(element) {
      var caretOffset = 0;
      var doc = element.ownerDocument || element.document;
      var win = doc.defaultView || doc.parentWindow;
      var range, preCaretRange;
      if (typeof win.getSelection !== 'undefined' && win.getSelection().rangeCount > 0) {
        range = win.getSelection().getRangeAt(0);
        preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
      return caretOffset;
    }

    //
    function addTrailingComma () {
      var currentValue = $input.text();

      if (currentValue) {
        $input.val(currentValue.replace(regexTrailingComma, ', '));
      }
    }

    //
    function removeTrailingComma () {
      var currentValue = $input.text();
      $input.val(currentValue.replace(regexTrailingComma, ''));
    }

    //
    var regexAmpersands = /&/g;
    var regexSingleQuotes = /'/g;
    var regexDoubleQuotes = /"/g;
    var regexLessThanSigns = /</g;
    var regexGreaterThanSigns = />/g;
    function htmlEscape(string) {
      return string
        .replace(regexAmpersands, '&amp;')
        .replace(regexSingleQuotes, '&#39;')
        .replace(regexDoubleQuotes, '&quot;')
        .replace(regexLessThanSigns, '&lt;')
        .replace(regexGreaterThanSigns, '&gt;');
    }

    initialize();
  };


  // AUTOCOMPLETE PLUGIN DEFINITION
  // ==============================

  $.fn.contenteditableAutocomplete = function (/*option*/) {
    return this.each(function () {
      var $this = $(this);
      var api  = $this.data('bs.contenteditableAutocomplete');

      if (!api) {
        $this.data('bs.contenteditableAutocomplete', (api = new ContenteditableAutocomplete(this)));
      }
    });
  };

  $.fn.contenteditableAutocomplete.Constructor = ContenteditableAutocomplete;


  // EDITABLE TABLE DATA-API
  // =======================

  $(document).on('focus.bs.contenteditableautocomplete.data-api', '[data-autocomplete-spy]', function(event) {
    var $input = $(event.currentTarget);

    event.preventDefault();
    event.stopImmediatePropagation();

    $input.removeAttr('data-autocomplete-spy').contenteditableAutocomplete();
    $input.trigger( $.Event(event) );
  });
})(jQuery);
