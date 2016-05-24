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
