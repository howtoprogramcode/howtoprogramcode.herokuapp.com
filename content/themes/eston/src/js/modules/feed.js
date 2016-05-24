// Feed Object - Used to get stuff from apis.

var Feed = {

  create : function ( $el, api, directive ) {

    // Create instance.
    var feed = Object.create( this );

    // Add elements.
    feed.$el = $el;

    // Add deferred.
    feed.$deferred = new $.Deferred();

    // Add api data.
    feed.api = $.extend( true, {}, api );

    // Add response data.
    feed.data = [];
    
    // Add directive.
    feed.directive = directive;

    // Return instance.
    return feed;

  },

  fetch : function ( ) {

    var self = this;
    return $.ajax( this.api );

  },

  get : function ( ) {

    return this.data;

  },

  set : function ( data ) {

    this.data = data;
  
  },

  render : function ( ) {

    this.$el.render( this.get(), this.directive );

  },

  start : function () {

    var self = this;

    this.fetch().done( function ( response ) {

      self.set( response );
      self.render();
      self.$deferred.resolve( self );

    }).fail( function () {

      self.$el.remove();
      self.$deferred.resolve( self );

    });

  
    return this.$deferred.promise();

  }

};

module.exports = Feed;
