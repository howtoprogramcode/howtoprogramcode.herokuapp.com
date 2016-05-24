var Dribbble = {

  'feed-author-url' : {
    href : function () {
      //return this.player.url;
    }
  },

  'feed-author-title' : {
    text : function () {
      //return this.player.name;
    }
  },

  'feed-media' : {
    style : function () {
      return 'background-image: url("' + ( this.images.hidpi || this.images.normal ) + '")';
    }
  },

  'feed-date' : {
    href : function () {
      return this.html_url;
    },
    text : function () {
      return this.created_at;
    }
  },

  'feed-comment' : {
    href : function () {
      return this.comments_url;
    },
    text : function () {
      return this.comments_count;
    }
  },

  'feed-like' : {
    href : function () {
      return this.likes_url;
    },
    text : function () {
      return this.likes_count;
    }
  }


};

module.exports = Dribbble;
