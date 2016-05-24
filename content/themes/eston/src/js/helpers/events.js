// Grok an empty jQuery object to use as an events bus, 
// rather than passing it into the module.

var events = $({});

module.exports = events;
