(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=/*

  Eston Config

*/

{

	"author"  : "mikedidthis",
	"version" : "1.1.0",

	"dribbble" : {
		"data" : {
			"page" : 1,
			"per_page" : 1
		},
	  "cache" : true,
    "dataType" : "jsonp",
    "source" : "shots",
    "url" : null
	},

	"instagram" : {
		"data" : {
			"access_token" : null,
			"count" : 33,
			"page" : 1,
			"per_page" : 1
		},
	  "cache" : true,
    "dataType" : "jsonp",
    "source" : "data",
    "url" : null
	},

	"share" : {
		"data" : {
			"apikey" : null,
			"url" : null,
		},
		"cache" : true,
		"dataType" : "json",
		"url" : "//free.sharedcount.com/"
	}

}

},{}],2:[function(require,module,exports){
/*

  Eston Core - <3 mikedidthis

*/

'use strict';

// Config.
var config = require( './config.json' );

// Libs.
var transparency = require( './lib/transparency' );

// Events.
var events = require( './helpers/events' );

// Helpers.
var helper = {
  distribute : require( './helpers/distribute-widgets' ),
  fluid : require( './helpers/fluid-element' ),
  hover : require( './helpers/hover-element' ),
  tag : require( './helpers/remove-helper-tags' ),
  offset : require( './helpers/offset-widgets' ),
  post : require( './helpers/ghost-post' ),
  shuffle : require( './helpers/shuffle-array' ),
};

// Directives.
var directive = {
  dribbble : require( './directives/dribbble' ),
  instagram : require( './directives/instagram' ),
  share : require( './directives/share' )
};

// Modules.
var module = {
  feed : require( './modules/feed' ),
  share : require( './modules/share' ),
  widget : require( './modules/widget' )
};

// Elements.
var $el = {
  dribbble : $( '[data-js~="dribbble"]' ),
  fluid : $( '[data-js~="fluid"]' ),
  hover : $( '[data-js~="hover"]' ),
  instagram : $( '[data-js="instagram"]' ),
  media : $( '[data-js~="media"]' ),
  pageCount : $( '[data-js~="pager-current"]' ),
  post : $( '[data-js~="post"]' ),
  share : $( '[data-js~="share"]' ),
  tag : $( '[data-js~="tags"]' ),
  widget : $( '[data-js~="widget"]' )
};

// Change transparency.js to use 'data-js'.
Transparency.matcher = function( element, key ) {
  return element.el.getAttribute( 'data-js' ) == key;
};

// Start.
var start = function ( options ) {

  // Merge any outside options into config.
  config = $.extend( true, config, options );

  // Offset widget api data.
  config = helper.offset( $el.pageCount.text(), config );

  // Store promises.
  var promises = [];
  var instances = [];

  // Create instances.
  $.each( $el.share, function () {
    var instance = module.share.create( $( this ), config.share, directive.share );
    instances.push( instance );
  });
  $.each( $el.dribbble, function () {
    var instance = module.widget.create( $( this ), config.dribbble, directive.dribbble );
    instances.push( instance );
    promises.push( instance.$deferred );
  });
  $.each( $el.instagram, function () {
    var instance = module.widget.create( $( this ), config.instagram, directive.instagram );
    instances.push( instance );
    promises.push( instance.$deferred );
  });

  // Run helpers.
  $.each( $el.post, function () {
    helper.post( $( this ) );
  });
  $.each( $el.hover, function () {
    helper.hover( $( this ) );
  });
  $.each( $el.fluid, function () {
    helper.fluid( $( this ) );
  });
  $.each( $el.tag, function () {
    helper.tag( $( this ) ); 
  });

  // Run instances.
  for ( var i = instances.length - 1; i >= 0; i-- ) {
    instances[ i ].start();
  };

  // Do stuff once promises have completed.
  $.when.apply( $, promises ).then( function () {

    // Shuffle widgets.
    var $widgets = helper.shuffle( $( $el.widget.selector ) );

    // Add widgets to the DOM.
    var $exports = helper.distribute( $el.post, $widgets, 2 );

    // Run hover helper for newly created widgets.
    $.each( $exports.filter( $el.widget.selector ), function () {
      helper.hover( $( this ) );
    });

    events.trigger( 'start.complete', [ $exports ] );

  });

};

// Expose to namespace.
window.eston = {
  config : config, 
  start : start,
  helper : helper,
  module : module,
  directive : directive,
  events : events,
  $el : $el
};

},{"./config.json":1,"./directives/dribbble":3,"./directives/instagram":4,"./directives/share":5,"./helpers/distribute-widgets":6,"./helpers/events":7,"./helpers/fluid-element":8,"./helpers/ghost-post":9,"./helpers/hover-element":10,"./helpers/offset-widgets":11,"./helpers/remove-helper-tags":13,"./helpers/shuffle-array":14,"./lib/transparency":23,"./modules/feed":24,"./modules/share":25,"./modules/widget":26}],3:[function(require,module,exports){
var timeago = require( '../helpers/time-ago' );
var truncate = require( '../helpers/truncate-number' );

var dribbble = {

  'widget-author-url' : {
    href : function () {
      return this.player.url;
    }
  },

  'widget-author-title' : {
    text : function () {
      return this.player.name;
    }
  },

  'widget-media' : {
    style : function () {
      return 'background-image: url(' + this.image_url + ')';
    }
  },

  'widget-date' : {
    href : function () {
      return this.url;
    }
  },

  'widget-date-stamp' : {
    text : function () {
      // Date returned is some bullshits ISO wannabe.
      return timeago( this.created_at.replace(/\//g, '-' ).replace(' ', 'T' ).replace(' ', '') );
    }
  },

  'widget-comment' : {
    href : function () {
      return this.url + '#comments';
    }
  },

  'widget-comment-count' : {
    text : function () {
      return truncate( this.comments_count );
    }
  },

  'widget-like' : {
    href : function () {
      return this.url + '/fans';
    }
  },

  'widget-like-count' : {
    text : function () {
      return truncate( this.likes_count );
    }
  }

};

module.exports = dribbble;

},{"../helpers/time-ago":15,"../helpers/truncate-number":16}],4:[function(require,module,exports){
var timeago = require( '../helpers/time-ago' );
var truncate = require( '../helpers/truncate-number' );

var instagram = {

  'widget-author-url' : {
    href : function () {
      return this.link;
    }
  },

  'widget-author-title' : {
    text : function () {
      return this.user.username;
    }
  },

  'widget-media' : {
    style : function () {
      return 'background-image: url(' + this.images.standard_resolution.url + ')';
    }
  },

  'widget-date' : {
    href : function () {
      return this.url;
    }
  },

  'widget-date-stamp' : {
    text : function () {
      return timeago( this.created_time );
    }
  },

  'widget-comment' : {
    href : function () {
      return this.link;
    }
  },

  'widget-comment-count' : {
    text : function () {
      return truncate( this.comments.count );
    }
  },

  'widget-like' : {
    href : function () {
      return this.link;
    }
  },

  'widget-like-count' : {
    text : function () {
      return truncate( this.likes.count );
    }
  }


};

module.exports = instagram;

},{"../helpers/time-ago":15,"../helpers/truncate-number":16}],5:[function(require,module,exports){
var truncate = require( '../helpers/truncate-number' );
var pluralize = require( '../helpers/pluralize-string' );

var share = {

  'share-facebook-count' : {
    text : function () {
      var count = this.Facebook.share_count;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
 'share-facebook-plural' : {
    text : function () {
      return pluralize( this.Facebook.share_count, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-googleplus-count' : {
    text : function () {
      var count = this.GooglePlusOne;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-googleplus-plural' : {
    text : function () {
      return pluralize( this.GooglePlusOne, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-linkedin-count' : {
    text : function () {
      var count = this.LinkedIn;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-linkedin-plural' : {
    text : function () {
      return pluralize( this.LinkedIn, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-pinterest-count' : {
    text : function () {
      var count = this.Pinterest;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-pinterst-plural' : {
    text : function () {
      return pluralize( this.Pinterest, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-stumbleupon-count' : {
    text : function () {
      var count = this.StumbleUpon;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-stumbleupon-plural' : {
    text : function () {
      return pluralize( this.StumbleUpon, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-twitter-count' : {
    text : function () {
      var count = this.Twitter;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( this.Twitter );
    }
  },
  'share-twitter-plural' : {
    text : function () {
      return pluralize( this.Twitter, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-total-count' : {
    text : function () {
      return truncate( this.Total );
    }
  },
  'share-total-plural' : {
    text : function () {
      return pluralize( this.Total, arguments[ 0 ].element.innerHTML );
    }
  }

};

module.exports = share;

},{"../helpers/pluralize-string":12,"../helpers/truncate-number":16}],6:[function(require,module,exports){
// Distributes $widgets, evenly, from the middle of $posts.
// Pretty broken, may revise one day.

var distributeWidgets = function ( $posts, $widgets, size ) {

  var gaps = $posts.length - 1;
  var top  = Math.floor( gaps / 2 );
  var bot  = Math.floor( gaps / 2 );
  var mid  = gaps - ( top + bot );
  var sets = ~~( $widgets.length / size );

  // If middle and gaps, sets are odd. If no middle and gaps, sets are even.
  if ( ( mid > 0  && sets % 2 === 0 ) || ( mid === 0 && sets % 2 === 1 ) ) {
    sets--;
  } 

  // If we have too many sets, set it to gaps.
  if ( sets > gaps ) {
    sets = gaps;
  }
  
  // Unwrap widgets.
  $widgets.unwrap();

  // Splice all the things!
  var $top = $widgets.splice( 0, ( top * size ) - ( gaps - sets ) );
  var $mid = $widgets.splice( 0, ( mid * size ) );
  var $bot = $widgets.splice( 0, ( bot * size ) - ( gaps - sets ) );
  var $exports = $posts.add( $top ).add( $bot ).add( $mid );

  // Add the middle.
  if ( mid > 0 ) {
    $posts.eq( top ).after( $mid );
  }
  // Add Top.
  for ( var i = 0, len = top; i < len; i++ ) {
    $posts.eq( i ).after( $top.splice( 0, size ) );
  }
  // Add Bottom.
  for ( var j = 0, ken = bot; j < ken; j++ ) {
    $posts.eq( ( gaps - 1 ) - j ).after( $bot.splice( 0, size ) );
  }

  // Remove any remaining.
  $widgets.remove();

  // Return all elements as a collection.
  return $exports;

};

module.exports = distributeWidgets;

},{}],7:[function(require,module,exports){
// Grok an empty jQuery object to use as an events bus, 
// rather than passing it into the module.

var events = $({});

module.exports = events;

},{}],8:[function(require,module,exports){
// Creates a fluid element, ala fluid css trick.

var fluidElement = function ( $el ) {

	// Calculate vertical ratio.
	var ratio = function () {

    var width  = $el.children().attr( 'width' );
    var height = $el.children().attr( 'height' );

    if ( width === '100%' ) {
      width = $el.parent().width();
    }
    if ( height === '100%' ) {
      height = $el.parent().height();
    }

    return ( ( 100 / width ) * height ) + '%';

	};

	// CSS.
	var css = {

	  wrapper : {
      'position':   'relative',
      'z-index':    '1',
      'overflow':   'hidden',
      'height':     '0',
      'paddingTop':  ratio()
    },

    el : {
      'position': 'absolute',
      'top':      '0',
      'right':    '0',
      'bottom':   '0',
      'left':     '0',
      'width':    '100%',
      'height':   '100%'
    }

	};

	// Render.
	$el.children().wrap( $( '<div />' ).css( css.wrapper ) ).css( css.el );

};

module.exports = fluidElement;

},{}],9:[function(require,module,exports){
// Removes any stray / duplicate elements that can't be handled with the ghost 
// template language.

var ghostPost = function( $el ) {

	// Cache elements.
	var $media = $el.find( '[data-js~="media"]' );
	var $excerpt = $el.find( '[data-js~="excerpt"]' );

	// Remove duplicate Iframe / Object / Embed.
	if ( $media.length ) {
		// Cache Iframe / Object / Embed.
		var $embed = $media.find( 'iframe, object, embed' );
		var $embeds = $el.find( 'iframe, object, embed' ).not( $embed );
		
		$.each( $embeds, function () {
			if ( $( this ).prop( 'src' ) === $embed.prop( 'src' ) ) {
				$( this ).remove();
			}
		});
	}

	// Remove empty excerpt.
	if ( $excerpt.length ) {
		// Check if there is any text inside the excerpt.
		if ( !$excerpt.text().trim().length ) {
      $excerpt.remove();
    }
	}

};

module.exports = ghostPost;

},{}],10:[function(require,module,exports){
// Binds hover event and pass a custom event. Used for applying animations.

var events = require( './events' );

var hoverElement = function ( $el ) {
  
  var $inner = $el.find( '[data-js~="hover-inner"]' );
  var $cover = $el.find( '[data-js~="hover-cover"]' );
  var $header = $el.find( '[data-js~="hover-header"]' );
  var $footer = $el.find( '[data-js~="hover-footer"]' );

  $inner.on( 'mouseenter', function ( e ) {
    e.preventDefault();
    e.stopPropagation();
    events.trigger( 'hover.start', [ $header, $cover, $footer ] );
  });

  $inner.on( 'mouseleave', function ( e ) {
    e.preventDefault();
    e.stopPropagation();
    events.trigger( 'hover.stop', [ $header, $cover, $footer ] );
  }); 

};

module.exports = hoverElement;

},{"./events":7}],11:[function(require,module,exports){
// Offsets widget api data, as Ghost doesn't allow {{page}} outside of the pagination
// variable.

var offsetWidgets = function ( page, config ) {

	page = parseInt( page, 10 );

  if ( config.dribbble.data.page ) {
    config.dribbble.data.page = page;
  }
  if ( config.instagram.data.page ) {
    config.instagram.data.page = page;
  }
  
  return config;

};

module.exports = offsetWidgets;

},{}],12:[function(require,module,exports){
// Removes the last character from a string, if the value is one.

var pluralizeString = function ( value, string ) {

  if ( parseInt( value, 10 ) === 1 ) {
    string = string.slice(0, - 1);
  } 

 	return string;

};

module.exports = pluralizeString;

},{}],13:[function(require,module,exports){
// Removes any tags prefixed with '_', which are used by the theme to set post types.

var removeHelperTags = function ( $el ) {

  var tags = [];

  $.each( $el.children(), function () {

  	if ( this.children[ 0 ].innerHTML.indexOf( '_' ) ) {
      tags.push( this );
    }

  });

  tags.length ? $el.html( tags ) : $el.remove();
  
};

module.exports = removeHelperTags;

},{}],14:[function(require,module,exports){
// Shuffles an array's order.

var shuffleArray = function ( array ) {

  for ( var i = array.length - 1; i > 0; i-- ) {
  	
    var j = Math.floor( Math.random() * ( i + 1 ) );
    var temp = array[ i ];
    array[ i ] = array[ j ];
    array[ j ] = temp;
    
  }

  return array;

};

module.exports = shuffleArray;

},{}],15:[function(require,module,exports){
// Converts a time format, into a time ago. Supports ISO and UNIX.

var timeAgo = function ( time ) {

  var templates = {
    prefix: '',
    suffix: ' ago',
    seconds: 'less than a minute',
    minute: 'a minute',
    minutes: '%d minutes',
    hour: 'an hour',
    hours: '%d hours',
    day: 'a day',
    days: '%d days',
    month: 'a month',
    months: '%d months',
    year: 'a year',
    years: '%d years'
  };

  var template = function ( t, n ) {
    return templates[ t ] && templates[ t ].replace( /%d/i, Math.abs( Math.round( n ) ) );
  };

  var timer = function ( time ) {
    
    if ( !time ) return;

    time = time.replace(/\.\d+/, '');
    time = time.replace(/-/, '/').replace(/-/, '/');
    time = time.replace(/T/, ' ').replace(/Z/, ' UTC');
    time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2');
    time = new Date( time * 1000 || time );

    var now = new Date();
    var seconds = ( ( now.getTime() - time ) * .001 ) >> 0;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    return templates.prefix + (
      seconds < 45 && template( 'seconds', seconds ) || 
      seconds < 90 && template( 'minute', 1 ) || 
      minutes < 45 && template( 'minutes', minutes ) || 
      minutes < 90 && template( 'hour', 1 ) || 
      hours < 24 && template( 'hours', hours ) || 
      hours < 42 && template( 'day', 1 ) || 
      days < 30 && template( 'days', days ) || 
      days < 45 && template( 'month', 1 ) || 
      days < 365 && template( 'months', days / 30 ) || 
      years < 1.5 && template( 'year', 1 ) || 
      template( 'years' , years ) ) 
    + templates.suffix;
  
  };

  return timer( time );

};

module.exports = timeAgo;

},{}],16:[function(require,module,exports){
// Truncates a number to one decimal place. 

var truncateNumber = function ( number ) {
	if ( number >= 1000000000 ) {
		return ( number / 1000000000 ).toFixed( 1 ) + 'G';
	}
	if ( number >= 1000000 ) {
		return ( number / 1000000 ).toFixed( 1 ) + 'M';
	}
	if ( number >= 1000 ) {
		return ( number / 1000 ).toFixed( 1 ) + 'K';
	}
	return number;
};

module.exports = truncateNumber;

},{}],17:[function(require,module,exports){
var Attribute, AttributeFactory, BooleanAttribute, Class, Html, Text, helpers, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('../lib/lodash');

helpers = require('./helpers');

module.exports = AttributeFactory = {
  Attributes: {},
  createAttribute: function(element, name) {
    var Attr;
    Attr = AttributeFactory.Attributes[name] || Attribute;
    return new Attr(element, name);
  }
};

Attribute = (function() {
  function Attribute(el, name) {
    this.el = el;
    this.name = name;
    this.templateValue = this.el.getAttribute(this.name) || '';
  }

  Attribute.prototype.set = function(value) {
    this.el[this.name] = value;
    return this.el.setAttribute(this.name, value.toString());
  };

  return Attribute;

})();

BooleanAttribute = (function(_super) {
  var BOOLEAN_ATTRIBUTES, name, _i, _len;

  __extends(BooleanAttribute, _super);

  BOOLEAN_ATTRIBUTES = ['hidden', 'async', 'defer', 'autofocus', 'formnovalidate', 'disabled', 'autofocus', 'formnovalidate', 'multiple', 'readonly', 'required', 'checked', 'scoped', 'reversed', 'selected', 'loop', 'muted', 'autoplay', 'controls', 'seamless', 'default', 'ismap', 'novalidate', 'open', 'typemustmatch', 'truespeed'];

  for (_i = 0, _len = BOOLEAN_ATTRIBUTES.length; _i < _len; _i++) {
    name = BOOLEAN_ATTRIBUTES[_i];
    AttributeFactory.Attributes[name] = BooleanAttribute;
  }

  function BooleanAttribute(el, name) {
    this.el = el;
    this.name = name;
    this.templateValue = this.el.getAttribute(this.name) || false;
  }

  BooleanAttribute.prototype.set = function(value) {
    this.el[this.name] = value;
    if (value) {
      return this.el.setAttribute(this.name, this.name);
    } else {
      return this.el.removeAttribute(this.name);
    }
  };

  return BooleanAttribute;

})(Attribute);

Text = (function(_super) {
  __extends(Text, _super);

  AttributeFactory.Attributes['text'] = Text;

  function Text(el, name) {
    var child;
    this.el = el;
    this.name = name;
    this.templateValue = ((function() {
      var _i, _len, _ref, _results;
      _ref = this.el.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.nodeType === helpers.TEXT_NODE) {
          _results.push(child.nodeValue);
        }
      }
      return _results;
    }).call(this)).join('');
    this.children = _.toArray(this.el.children);
    if (!(this.textNode = this.el.firstChild)) {
      this.el.appendChild(this.textNode = this.el.ownerDocument.createTextNode(''));
    } else if (this.textNode.nodeType !== helpers.TEXT_NODE) {
      this.textNode = this.el.insertBefore(this.el.ownerDocument.createTextNode(''), this.textNode);
    }
  }

  Text.prototype.set = function(text) {
    var child, _i, _len, _ref, _results;
    while (child = this.el.firstChild) {
      this.el.removeChild(child);
    }
    this.textNode.nodeValue = text;
    this.el.appendChild(this.textNode);
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(this.el.appendChild(child));
    }
    return _results;
  };

  return Text;

})(Attribute);

Html = (function(_super) {
  __extends(Html, _super);

  AttributeFactory.Attributes['html'] = Html;

  function Html(el) {
    this.el = el;
    this.templateValue = '';
    this.children = _.toArray(this.el.children);
  }

  Html.prototype.set = function(html) {
    var child, _i, _len, _ref, _results;
    while (child = this.el.firstChild) {
      this.el.removeChild(child);
    }
    this.el.innerHTML = html + this.templateValue;
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(this.el.appendChild(child));
    }
    return _results;
  };

  return Html;

})(Attribute);

Class = (function(_super) {
  __extends(Class, _super);

  AttributeFactory.Attributes['class'] = Class;

  function Class(el) {
    Class.__super__.constructor.call(this, el, 'class');
  }

  return Class;

})(Attribute);

},{"../lib/lodash":22,"./helpers":20}],18:[function(require,module,exports){
var Context, Instance, after, before, chainable, cloneNode, _ref;

_ref = require('./helpers'), before = _ref.before, after = _ref.after, chainable = _ref.chainable, cloneNode = _ref.cloneNode;

Instance = require('./instance');

module.exports = Context = (function() {
  var attach, detach;

  detach = chainable(function() {
    this.parent = this.el.parentNode;
    if (this.parent) {
      this.nextSibling = this.el.nextSibling;
      return this.parent.removeChild(this.el);
    }
  });

  attach = chainable(function() {
    if (this.parent) {
      if (this.nextSibling) {
        return this.parent.insertBefore(this.el, this.nextSibling);
      } else {
        return this.parent.appendChild(this.el);
      }
    }
  });

  function Context(el, Transparency) {
    this.el = el;
    this.Transparency = Transparency;
    this.template = cloneNode(this.el);
    this.instances = [new Instance(this.el, this.Transparency)];
    this.instanceCache = [];
  }

  Context.prototype.render = before(detach)(after(attach)(chainable(function(models, directives, options) {
    var children, index, instance, model, _i, _len, _results;
    while (models.length < this.instances.length) {
      this.instanceCache.push(this.instances.pop().remove());
    }
    while (models.length > this.instances.length) {
      instance = this.instanceCache.pop() || new Instance(cloneNode(this.template), this.Transparency);
      this.instances.push(instance.appendTo(this.el));
    }
    _results = [];
    for (index = _i = 0, _len = models.length; _i < _len; index = ++_i) {
      model = models[index];
      instance = this.instances[index];
      children = [];
      _results.push(instance.prepare(model, children).renderValues(model, children).renderDirectives(model, index, directives).renderChildren(model, children, directives, options));
    }
    return _results;
  })));

  return Context;

})();

},{"./helpers":20,"./instance":21}],19:[function(require,module,exports){
var AttributeFactory, Checkbox, Element, ElementFactory, Input, Radio, Select, TextArea, VoidElement, helpers, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('../lib/lodash.js');

helpers = require('./helpers');

AttributeFactory = require('./attributeFactory');

module.exports = ElementFactory = {
  Elements: {
    input: {}
  },
  createElement: function(el) {
    var El, name;
    if ('input' === (name = el.nodeName.toLowerCase())) {
      El = ElementFactory.Elements[name][el.type.toLowerCase()] || Input;
    } else {
      El = ElementFactory.Elements[name] || Element;
    }
    return new El(el);
  }
};

Element = (function() {
  function Element(el) {
    this.el = el;
    this.attributes = {};
    this.childNodes = _.toArray(this.el.childNodes);
    this.nodeName = this.el.nodeName.toLowerCase();
    this.classNames = this.el.className.split(' ');
    this.originalAttributes = {};
  }

  Element.prototype.empty = function() {
    var child;
    while (child = this.el.firstChild) {
      this.el.removeChild(child);
    }
    return this;
  };

  Element.prototype.reset = function() {
    var attribute, name, _ref, _results;
    _ref = this.attributes;
    _results = [];
    for (name in _ref) {
      attribute = _ref[name];
      _results.push(attribute.set(attribute.templateValue));
    }
    return _results;
  };

  Element.prototype.render = function(value) {
    return this.attr('text', value);
  };

  Element.prototype.attr = function(name, value) {
    var attribute, _base;
    attribute = (_base = this.attributes)[name] || (_base[name] = AttributeFactory.createAttribute(this.el, name, value));
    if (value != null) {
      attribute.set(value);
    }
    return attribute;
  };

  Element.prototype.renderDirectives = function(model, index, attributes) {
    var directive, name, value, _results;
    _results = [];
    for (name in attributes) {
      if (!__hasProp.call(attributes, name)) continue;
      directive = attributes[name];
      if (!(typeof directive === 'function')) {
        continue;
      }
      value = directive.call(model, {
        element: this.el,
        index: index,
        value: this.attr(name).templateValue
      });
      if (value != null) {
        _results.push(this.attr(name, value));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Element;

})();

Select = (function(_super) {
  __extends(Select, _super);

  ElementFactory.Elements['select'] = Select;

  function Select(el) {
    Select.__super__.constructor.call(this, el);
    this.elements = helpers.getElements(el);
  }

  Select.prototype.render = function(value) {
    var option, _i, _len, _ref, _results;
    value = value.toString();
    _ref = this.elements;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      if (option.nodeName === 'option') {
        _results.push(option.attr('selected', option.el.value === value));
      }
    }
    return _results;
  };

  return Select;

})(Element);

VoidElement = (function(_super) {
  var VOID_ELEMENTS, nodeName, _i, _len;

  __extends(VoidElement, _super);

  function VoidElement() {
    return VoidElement.__super__.constructor.apply(this, arguments);
  }

  VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  for (_i = 0, _len = VOID_ELEMENTS.length; _i < _len; _i++) {
    nodeName = VOID_ELEMENTS[_i];
    ElementFactory.Elements[nodeName] = VoidElement;
  }

  VoidElement.prototype.attr = function(name, value) {
    if (name !== 'text' && name !== 'html') {
      return VoidElement.__super__.attr.call(this, name, value);
    }
  };

  return VoidElement;

})(Element);

Input = (function(_super) {
  __extends(Input, _super);

  function Input() {
    return Input.__super__.constructor.apply(this, arguments);
  }

  Input.prototype.render = function(value) {
    return this.attr('value', value);
  };

  return Input;

})(VoidElement);

TextArea = (function(_super) {
  __extends(TextArea, _super);

  function TextArea() {
    return TextArea.__super__.constructor.apply(this, arguments);
  }

  ElementFactory.Elements['textarea'] = TextArea;

  return TextArea;

})(Input);

Checkbox = (function(_super) {
  __extends(Checkbox, _super);

  function Checkbox() {
    return Checkbox.__super__.constructor.apply(this, arguments);
  }

  ElementFactory.Elements['input']['checkbox'] = Checkbox;

  Checkbox.prototype.render = function(value) {
    return this.attr('checked', Boolean(value));
  };

  return Checkbox;

})(Input);

Radio = (function(_super) {
  __extends(Radio, _super);

  function Radio() {
    return Radio.__super__.constructor.apply(this, arguments);
  }

  ElementFactory.Elements['input']['radio'] = Radio;

  return Radio;

})(Checkbox);

},{"../lib/lodash.js":22,"./attributeFactory":17,"./helpers":20}],20:[function(require,module,exports){
var ElementFactory, expando, html5Clone, _getElements;

ElementFactory = require('./elementFactory');

exports.before = function(decorator) {
  return function(method) {
    return function() {
      decorator.apply(this, arguments);
      return method.apply(this, arguments);
    };
  };
};

exports.after = function(decorator) {
  return function(method) {
    return function() {
      method.apply(this, arguments);
      return decorator.apply(this, arguments);
    };
  };
};

exports.chainable = exports.after(function() {
  return this;
});

exports.onlyWith$ = function(fn) {
  if ((typeof jQuery !== "undefined" && jQuery !== null) || (typeof Zepto !== "undefined" && Zepto !== null)) {
    return (function($) {
      return fn(arguments);
    })(jQuery || Zepto);
  }
};

exports.getElements = function(el) {
  var elements;
  elements = [];
  _getElements(el, elements);
  return elements;
};

_getElements = function(template, elements) {
  var child, _results;
  child = template.firstChild;
  _results = [];
  while (child) {
    if (child.nodeType === exports.ELEMENT_NODE) {
      elements.push(new ElementFactory.createElement(child));
      _getElements(child, elements);
    }
    _results.push(child = child.nextSibling);
  }
  return _results;
};

exports.ELEMENT_NODE = 1;

exports.TEXT_NODE = 3;

html5Clone = function() {
  return document.createElement('nav').cloneNode(true).outerHTML !== '<:nav></:nav>';
};

exports.cloneNode = (typeof document === "undefined" || document === null) || html5Clone() ? function(node) {
  return node.cloneNode(true);
} : function(node) {
  var cloned, element, _i, _len, _ref;
  cloned = Transparency.clone(node);
  if (cloned.nodeType === exports.ELEMENT_NODE) {
    cloned.removeAttribute(expando);
    _ref = cloned.getElementsByTagName('*');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      element.removeAttribute(expando);
    }
  }
  return cloned;
};

expando = 'transparency';

exports.data = function(element) {
  return element[expando] || (element[expando] = {});
};

exports.nullLogger = function() {};

exports.consoleLogger = function() {
  return console.log(arguments);
};

exports.log = exports.nullLogger;

},{"./elementFactory":19}],21:[function(require,module,exports){
var Instance, chainable, helpers, _,
  __hasProp = {}.hasOwnProperty;

_ = require('../lib/lodash.js');

chainable = (helpers = require('./helpers')).chainable;

module.exports = Instance = (function() {
  function Instance(template, Transparency) {
    this.Transparency = Transparency;
    this.queryCache = {};
    this.childNodes = _.toArray(template.childNodes);
    this.elements = helpers.getElements(template);
  }

  Instance.prototype.remove = chainable(function() {
    var node, _i, _len, _ref, _results;
    _ref = this.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      _results.push(node.parentNode.removeChild(node));
    }
    return _results;
  });

  Instance.prototype.appendTo = chainable(function(parent) {
    var node, _i, _len, _ref, _results;
    _ref = this.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      _results.push(parent.appendChild(node));
    }
    return _results;
  });

  Instance.prototype.prepare = chainable(function(model) {
    var element, _i, _len, _ref, _results;
    _ref = this.elements;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      element.reset();
      _results.push(helpers.data(element.el).model = model);
    }
    return _results;
  });

  Instance.prototype.renderValues = chainable(function(model, children) {
    var element, key, value, _results;
    if (_.isElement(model) && (element = this.elements[0])) {
      return element.empty().el.appendChild(model);
    } else if (typeof model === 'object') {
      _results = [];
      for (key in model) {
        if (!__hasProp.call(model, key)) continue;
        value = model[key];
        if (value != null) {
          if (_.isString(value) || _.isNumber(value) || _.isBoolean(value) || _.isDate(value)) {
            _results.push((function() {
              var _i, _len, _ref, _results1;
              _ref = this.matchingElements(key);
              _results1 = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                element = _ref[_i];
                _results1.push(element.render(value));
              }
              return _results1;
            }).call(this));
          } else if (typeof value === 'object') {
            _results.push(children.push(key));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    }
  });

  Instance.prototype.renderDirectives = chainable(function(model, index, directives) {
    var attributes, element, key, _results;
    _results = [];
    for (key in directives) {
      if (!__hasProp.call(directives, key)) continue;
      attributes = directives[key];
      if (!(typeof attributes === 'object')) {
        continue;
      }
      if (typeof model !== 'object') {
        model = {
          value: model
        };
      }
      _results.push((function() {
        var _i, _len, _ref, _results1;
        _ref = this.matchingElements(key);
        _results1 = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results1.push(element.renderDirectives(model, index, attributes));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  });

  Instance.prototype.renderChildren = chainable(function(model, children, directives, options) {
    var element, key, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      key = children[_i];
      _results.push((function() {
        var _j, _len1, _ref, _results1;
        _ref = this.matchingElements(key);
        _results1 = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          element = _ref[_j];
          _results1.push(this.Transparency.render(element.el, model[key], directives[key], options));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  });

  Instance.prototype.matchingElements = function(key) {
    var el, elements, _base;
    elements = (_base = this.queryCache)[key] || (_base[key] = (function() {
      var _i, _len, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        if (this.Transparency.matcher(el, key)) {
          _results.push(el);
        }
      }
      return _results;
    }).call(this));
    helpers.log("Matching elements for '" + key + "':", elements);
    return elements;
  };

  return Instance;

})();

},{"../lib/lodash.js":22,"./helpers":20}],22:[function(require,module,exports){
 var _ = {};

_.toString = Object.prototype.toString;

_.toArray = function(obj) {
  var arr = new Array(obj.length);
  for (var i = 0; i < obj.length; i++) {
    arr[i] = obj[i];
  }
  return arr;
};

_.isString = function(obj) { return _.toString.call(obj) == '[object String]'; };

_.isNumber = function(obj) { return _.toString.call(obj) == '[object Number]'; };

_.isArray = Array.isArray || function(obj) {
  return _.toString.call(obj) === '[object Array]';
};

_.isDate = function(obj) {
  return _.toString.call(obj) === '[object Date]';
};

_.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1);
};

_.isPlainValue = function(obj) {
  var type;
  type = typeof obj;
  return (type !== 'object' && type !== 'function') || exports.isDate(obj);
};

_.isBoolean = function(obj) {
  return obj === true || obj === false;
};

module.exports = _;

},{}],23:[function(require,module,exports){
var $, Context, Transparency, helpers, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('../lib/lodash.js');

helpers = require('./helpers');

Context = require('./context');

Transparency = {};

Transparency.render = function(context, models, directives, options) {
  var log, _base;
  if (models == null) {
    models = [];
  }
  if (directives == null) {
    directives = {};
  }
  if (options == null) {
    options = {};
  }
  log = options.debug && console ? helpers.consoleLogger : helpers.nullLogger;
  log("Transparency.render:", context, models, directives, options);
  if (!context) {
    return;
  }
  if (!_.isArray(models)) {
    models = [models];
  }
  context = (_base = helpers.data(context)).context || (_base.context = new Context(context, Transparency));
  return context.render(models, directives, options).el;
};

Transparency.matcher = function(element, key) {
  return element.el.id === key || __indexOf.call(element.classNames, key) >= 0 || element.el.name === key || element.el.getAttribute('data-bind') === key;
};

Transparency.clone = function(node) {
  return $(node).clone()[0];
};

Transparency.jQueryPlugin = helpers.chainable(function(models, directives, options) {
  var context, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    context = this[_i];
    _results.push(Transparency.render(context, models, directives, options));
  }
  return _results;
});

if ((typeof jQuery !== "undefined" && jQuery !== null) || (typeof Zepto !== "undefined" && Zepto !== null)) {
  $ = jQuery || Zepto;
  if ($ != null) {
    $.fn.render = Transparency.jQueryPlugin;
  }
}

if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
  module.exports = Transparency;
}

if (typeof window !== "undefined" && window !== null) {
  window.Transparency = Transparency;
}

if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
  define(function() {
    return Transparency;
  });
}

},{"../lib/lodash.js":22,"./context":18,"./helpers":20}],24:[function(require,module,exports){
// Feed Object - Used to get stuff from apis.

var Feed = {

  create : function ( $el, api, directive ) {

    // Create instance.
    var feed = Object.create( this );

    // Add elements.
    feed.$el = $el;

    // Add deferred.
    feed.$deferred = new $.Deferred();

    // Add api data.
    feed.api = $.extend( true, {}, api );

    // Add response data.
    feed.data = [];
    
    // Add directive.
    feed.directive = directive;

    // Return instance.
    return feed;

  },

  fetch : function ( ) {

    var self = this;
    return $.ajax( this.api );

  },

  get : function ( ) {

    return this.data;

  },

  set : function ( data ) {

    this.data = data;
  
  },

  render : function ( ) {

    this.$el.render( this.get(), this.directive );

  },

  start : function () {

    var self = this;

    this.fetch().done( function ( response ) {

      self.set( response );
      self.render();
      self.$deferred.resolve( self );

    }).fail( function () {

      self.$el.remove();
      self.$deferred.resolve( self );

    });

  
    return this.$deferred.promise();

  }

};

module.exports = Feed;

},{}],25:[function(require,module,exports){
// Share object - Based on Feed, gets share data from the API and binds some buttons.
var events = require( '../helpers/events' );
var Feed = require( './feed' );

var Share = Object.create( Feed, {

  create : {

    value : function ( $el, api, directive ) {

      // Create instance.
      var share = Feed.create.call( this, $el, api, directive );

      // Add elements.
      share.$list = $el.find( '[data-js="share-list"]' );

      // Add data.
      share.api.data.url = $el.data( 'js-url' );

      // Return instance.
      return share;

    }

  },

  bind : {

    value : function () {

      var self = this;
      var open = false;
      
      this.$el.on( 'click', function ( e ) {

        e.preventDefault();

        if ( !open ) {
          events.trigger( 'share.open', [ self.$el, self.$list ] );
          open = true;
        } else {
          events.trigger( 'share.close', [ self.$el, self.$list ] );
          open = false;
        }

      });
    }
  
  },

  start : {

    value : function () {

      var self = this;

      this.fetch().done( function ( response ) {

        self.set( response );
        self.render();
        self.bind();
        self.$deferred.resolve( self );

      }).fail( function () {

        self.$el.remove();
        self.$deferred.resolve( self );

      });
    
      return this.$deferred.promise();

    }

  }

});

module.exports = Share;

},{"../helpers/events":7,"./feed":24}],26:[function(require,module,exports){
// Widget object - Based on Feed, gets data from an API and creates multiple widgets.

var events = require( '../helpers/events' );
var Feed = require( './feed' );

var Widget = Object.create( Feed, {

  create : {
    value : function ( $el, api, directive ) {

      // Create instance.
      var widget = Feed.create.call( this, $el, api, directive );

      // Return instance.
      return widget;

    }
  },

  trim : {
    value : function ( response ) {

      var data = response[ this.api.source ];
      var count = parseInt( this.api.data.per_page || this.api.data.perpage , 10 );
      var page = this.api.data.page;

      // Dickbutt apis don't allow pagination requests.
      if ( data && data.length > count ) {
        data = data.slice( ( count * page ) - count, count * page );
      }

      return data;

    }
  },

  update : {
    value : function () {

      // Recache $el to be the children, not the parent.
      this.$el = this.$el.find( '[data-js="widget"]' );
      this.$el.selector = '[data-js="widget"]';

    }
  },

  start : {
    value : function () {

      var self = this;

      // Success.
      this.fetch().done( function ( response ) {

        self.set( self.trim( response ) );
        self.render();
        self.update();
        self.$deferred.resolve( self );

      // Fail.
      }).fail( function () {

        self.$el.remove();
        self.$deferred.resolve( self );

      });
    
      return this.$deferred.promise();

    }
  }

});


module.exports = Widget;

},{"../helpers/events":7,"./feed":24}]},{},[2]);
