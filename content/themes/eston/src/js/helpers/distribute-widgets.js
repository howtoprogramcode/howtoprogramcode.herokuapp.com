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
