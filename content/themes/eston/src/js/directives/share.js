var truncate = require( '../helpers/truncate-number' );
var pluralize = require( '../helpers/pluralize-string' );

var share = {

  'share-facebook-count' : {
    text : function () {
      var count = this.Facebook.share_count;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
 'share-facebook-plural' : {
    text : function () {
      return pluralize( this.Facebook.share_count, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-googleplus-count' : {
    text : function () {
      var count = this.GooglePlusOne;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-googleplus-plural' : {
    text : function () {
      return pluralize( this.GooglePlusOne, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-linkedin-count' : {
    text : function () {
      var count = this.LinkedIn;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-linkedin-plural' : {
    text : function () {
      return pluralize( this.LinkedIn, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-pinterest-count' : {
    text : function () {
      var count = this.Pinterest;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-pinterst-plural' : {
    text : function () {
      return pluralize( this.Pinterest, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-stumbleupon-count' : {
    text : function () {
      var count = this.StumbleUpon;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( count );
    }
  },
  'share-stumbleupon-plural' : {
    text : function () {
      return pluralize( this.StumbleUpon, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-twitter-count' : {
    text : function () {
      var count = this.Twitter;
      this.Total = this.Total || 0;
      this.Total = count + this.Total;
      return truncate( this.Twitter );
    }
  },
  'share-twitter-plural' : {
    text : function () {
      return pluralize( this.Twitter, arguments[ 0 ].element.innerHTML );
    }
  },

  'share-total-count' : {
    text : function () {
      return truncate( this.Total );
    }
  },
  'share-total-plural' : {
    text : function () {
      return pluralize( this.Total, arguments[ 0 ].element.innerHTML );
    }
  }

};

module.exports = share;
