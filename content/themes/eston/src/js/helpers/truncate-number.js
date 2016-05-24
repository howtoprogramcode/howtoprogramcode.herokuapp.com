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
