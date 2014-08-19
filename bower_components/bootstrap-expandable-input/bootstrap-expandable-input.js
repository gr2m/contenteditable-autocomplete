(function ($) {
  'use strict';

  // EXPANDABLE INPUT CLASS DEFINITION
  // =================================

  //
  //
  //
  var ExpandableInput = function (el) {
    var $input;
    var valueOnFocus;

    // 1. cache elements for performance reasons and
    // 2. setup event bindings
    function initialize () {
      $input = $(el);
      setName();
      initStyling();

      $input.on('input', handleInput);
      $input.on('focus', handleFocus);
      $input.on('blur', handleBlur);
      $input.on('keyup', handleKeyUp);
    }

    // Event handlers
    // --------------

    //
    function handleInput ( /*event*/ ) {
      cleanupIfEmpty();
    }

    //
    function handleFocus ( /*event*/ ) {
      valueOnFocus = $input.text();
    }

    //
    function handleBlur ( /*event*/ ) {
      var valueOnBlur = $input.text();
      if (valueOnBlur !== valueOnFocus) {
        $input.trigger('change');
      }
    }

    //
    function handleKeyUp ( event ) {
      var enteredViaTabKey = event.which === 9;
      if (enteredViaTabKey) {// TAB
        $input.select();
      }
    }


    // Internal Methods
    // ----------------

    //
    //
    //
    function setName () {
      var name = $input.attr('name');
      if (name) $input[0].name = name;
    }

    //
    // adds `contenteditable-inline` or `contenteditable-block`,
    // depending of the styling of the input. This is needed to
    // prevent line breaks in inline elements, among other things.
    //
    function initStyling () {
      var display = $input.css('display');

      if (display === 'inline' || display === 'inline-block') {
        $input.addClass('contenteditable-inline');
      } else {
        $input.addClass('contenteditable-block');
      }


      // set min width to current width unless already set
      $input.css({
        'min-width': ''+$input.outerWidth()+'px'
      });
    }


    //
    //
    //
    function cleanupIfEmpty() {
      var content = $input.html();
      if (content === '<br>' || content === '<div><br></div>') {
        $input.html( '' );
      }
    }

    initialize();
  };

  // EXPANDABLE INPUT PLUGIN DEFINITION
  // ==================================

  $.fn.expandableInput = function (option) {
    return this.each(function () {
      var $this = $(this);
      var api  = $this.data('bs.expandableInput');

      if (!api) {
        $this.data('bs.expandableInput', (api = new ExpandableInput(this)));
      }
      if (typeof option === 'string') {
        api[option].call($this);
      }
    });
  };

  $.fn.expandableInput.Constructor = ExpandableInput;


  // JQUERY PATCHES
  // ==============

  //
  // implements $('[contenteditable]').val()
  //
  var regexNewLines = /\n/g;
  var regexAmpersands = /&/g;
  var regexLessThanSigns = /</g;
  var regexGreaterThanSigns = />/g;
  var regexWhiteSpaces = /\s+$/g;
  var regexBr = /<br>/gi;
  var regexDivCloseAndOpen = /<div>\s*<\/div>/gi;
  var regexLineBreakElements = /(<div>|<\/div>)/gi;
  var regexTags = /<[^>]+>/gi;
  var regexSpacesNotPrecedByWordBreaks = /\B /g;
  var regexMultipleSpaces = / +/g;
  var regexEntity = /&([^;]+);/g;
  function patchJQueryVal () {
    var origVal = $.fn.val;
    $.fn.val = function(text) {
      if (this.is('[contenteditable]')) {
        if (arguments.length === 0) {
          // .textContent removes all line breaks, which is why we
          // have to use .innerHTML and manually remove all HTML tags
          // We could use .innerText, but that is not supported in Firefox
          return this[0].innerHTML
            .replace(regexBr, '\n')
            .replace(regexDivCloseAndOpen, '\n')
            .replace(regexLineBreakElements, '\n')
            .replace(regexTags, '')
            .replace(regexMultipleSpaces, ' ')
            .replace(regexEntity, replaceEntity)
            .trim();
        }

        text = String(text || '');
        text = text.replace(regexAmpersands, '&amp;');
        text = text.replace(regexLessThanSigns, '&lt;');
        text = text.replace(regexGreaterThanSigns, '&gt;');
        text = text.replace(regexWhiteSpaces, '&nbsp;');
        text = text.replace(regexNewLines, '<br>');
        text = text.replace(regexSpacesNotPrecedByWordBreaks, '&nbsp;');
        return this.html( text );
      }
      return origVal.apply(this, arguments);
    };
  }

  var ENTITIES = {'quot':'"','amp':'&','apos':'\'','lt':'<','gt':'>','nbsp':' ','iexcl':'¡','cent':'¢','pound':'£','curren':'¤','yen':'¥','brvbar':'¦','sect':'§','uml':'¨','copy':'©','ordf':'ª','laquo':'«','not':'¬','shy':' ','reg':'®','macr':'¯','deg':'°','plusmn':'±','sup2':'²','sup3':'³','acute':'´','micro':'µ','para':'¶','middot':'·','cedil':'¸','sup1':'¹','ordm':'º','raquo':'»','frac14':'¼','frac12':'½','frac34':'¾','iquest':'¿','Agrave':'À','Aacute':'Á','Acirc':'Â','Atilde':'Ã','Auml':'Ä','Aring':'Å','AElig':'Æ','Ccedil':'Ç','Egrave':'È','Eacute':'É','Ecirc':'Ê','Euml':'Ë','Igrave':'Ì','Iacute':'Í','Icirc':'Î','Iuml':'Ï','ETH':'Ð','Ntilde':'Ñ','Ograve':'Ò','Oacute':'Ó','Ocirc':'Ô','Otilde':'Õ','Ouml':'Ö','times':'×','Oslash':'Ø','Ugrave':'Ù','Uacute':'Ú','Ucirc':'Û','Uuml':'Ü','Yacute':'Ý','THORN':'Þ','szlig':'ß','agrave':'à','aacute':'á','acirc':'â','atilde':'ã','auml':'ä','aring':'å','aelig':'æ','ccedil':'ç','egrave':'è','eacute':'é','ecirc':'ê','euml':'ë','igrave':'ì','iacute':'í','icirc':'î','iuml':'ï','eth':'ð','ntilde':'ñ','ograve':'ò','oacute':'ó','ocirc':'ô','otilde':'õ','ouml':'ö','divide':'÷','oslash':'ø','ugrave':'ù','uacute':'ú','ucirc':'û','uuml':'ü','yacute':'ý','thorn':'þ','yuml':'ÿ','OElig':'Œ','oelig':'œ','Scaron':'Š','scaron':'š','Yuml':'Ÿ','fnof':'ƒ','circ':'ˆ','tilde':'˜','Alpha':'Α','Beta':'Β','Gamma':'Γ','Delta':'Δ','Epsilon':'Ε','Zeta':'Ζ','Eta':'Η','Theta':'Θ','Iota':'Ι','Kappa':'Κ','Lambda':'Λ','Mu':'Μ','Nu':'Ν','Xi':'Ξ','Omicron':'Ο','Pi':'Π','Rho':'Ρ','Sigma':'Σ','Tau':'Τ','Upsilon':'Υ','Phi':'Φ','Chi':'Χ','Psi':'Ψ','Omega':'Ω','alpha':'α','beta':'β','gamma':'γ','delta':'δ','epsilon':'ε','zeta':'ζ','eta':'η','theta':'θ','iota':'ι','kappa':'κ','lambda':'λ','mu':'μ','nu':'ν','xi':'ξ','omicron':'ο','pi':'π','rho':'ρ','sigmaf':'ς','sigma':'σ','tau':'τ','upsilon':'υ','phi':'φ','chi':'χ','psi':'ψ','omega':'ω','thetasym':'ϑ','upsih':'ϒ','piv':'ϖ','ensp':' ','emsp':' ','thinsp':'','zwnj':' ','zwj':' ','lrm':' ','rlm':' ','ndash':'–','mdash':'—','lsquo':'‘','rsquo':'’','sbquo':'‚','ldquo':'“','rdquo':'”','bdquo':'„','dagger':'†','Dagger':'‡','bull':'•','hellip':'…','permil':'‰','prime':'′','Prime':'″','lsaquo':'‹','rsaquo':'›','oline':'‾','frasl':'⁄','euro':'€','image':'ℑ','weierp':'℘','real':'ℜ','trade':'™','alefsym':'ℵ','larr':'←','uarr':'↑','rarr':'→','darr':'↓','harr':'↔','crarr':'↵','lArr':'⇐','uArr':'⇑','rArr':'⇒','dArr':'⇓','hArr':'⇔','forall':'∀','part':'∂','exist':'∃','empty':'∅','nabla':'∇','isin':'∈','notin':'∉','ni':'∋','prod':'∏','sum':'∑','minus':'−','lowast':'∗','radic':'√','prop':'∝','infin':'∞','ang':'∠','and':'∧','or':'∨','cap':'∩','cup':'∪','int':'∫','there4':'∴','sim':'∼','cong':'≅','asymp':'≈','ne':'≠','equiv':'≡','le':'≤','ge':'≥','sub':'⊂','sup':'⊃','nsub':'⊄','sube':'⊆','supe':'⊇','oplus':'⊕','otimes':'⊗','perp':'⊥','sdot':'⋅','vellip':'⋮','lceil':'⌈','rceil':'⌉','lfloor':'⌊','rfloor':'⌋','lang':'〈','rang':'〉','loz':'◊','spades':'♠','clubs':'♣','hearts':'♥','diams':'♦'};
  function replaceEntity(match, entity) {
    return ENTITIES[entity] || '';
  }

  //
  // implements $('[contenteditable]').select()
  //
  function patchJQuerySelect () {
    var origSelect = $.fn.select;
    $.fn.select = function() {
      if ($(this).is('[contenteditable]')) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(this[0]);
        selection.removeAllRanges();
        selection.addRange(range);
        return ;
      }
      return origSelect.apply(this, arguments);
    };
  }

  // EXPANDABLE INPUT DATA-API
  // =========================

  $(document).on('focus.bs.expandableInput.data-api', '[contenteditable]', function(event) {
    var $input = $(event.currentTarget);

    // already initialized? Stop here.
    if ($input.data('bs.expandableInput')) return true;

    event.preventDefault();
    event.stopImmediatePropagation();

    // init expandable behaviour
    $input.expandableInput();
    $input.trigger( $.Event(event) );
  });


  // patch jQuery methods
  patchJQueryVal();
  patchJQuerySelect();
})(jQuery);
