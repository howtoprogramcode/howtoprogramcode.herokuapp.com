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
