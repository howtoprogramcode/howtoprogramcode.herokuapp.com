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
