var timeago = require( '../helpers/time-ago' );
var truncate = require( '../helpers/truncate-number' );

var dribbble = {

  'widget-author-url' : {
    href : function () {
      return this.player.url;
    }
  },

  'widget-author-title' : {
    text : function () {
      return this.player.name;
    }
  },

  'widget-media' : {
    style : function () {
      return 'background-image: url(' + this.image_url + ')';
    }
  },

  'widget-date' : {
    href : function () {
      return this.url;
    }
  },

  'widget-date-stamp' : {
    text : function () {
      // Date returned is some bullshits ISO wannabe.
      return timeago( this.created_at.replace(/\//g, '-' ).replace(' ', 'T' ).replace(' ', '') );
    }
  },

  'widget-comment' : {
    href : function () {
      return this.url + '#comments';
    }
  },

  'widget-comment-count' : {
    text : function () {
      return truncate( this.comments_count );
    }
  },

  'widget-like' : {
    href : function () {
      return this.url + '/fans';
    }
  },

  'widget-like-count' : {
    text : function () {
      return truncate( this.likes_count );
    }
  }

};

module.exports = dribbble;
