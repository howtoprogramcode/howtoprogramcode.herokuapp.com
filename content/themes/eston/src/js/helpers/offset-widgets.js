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
