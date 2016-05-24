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
