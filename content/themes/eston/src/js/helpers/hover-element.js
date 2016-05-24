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
