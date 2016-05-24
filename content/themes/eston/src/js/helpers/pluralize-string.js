// Removes the last character from a string, if the value is one.

var pluralizeString = function ( value, string ) {

  if ( parseInt( value, 10 ) === 1 ) {
    string = string.slice(0, - 1);
  } 

 	return string;

};

module.exports = pluralizeString;
