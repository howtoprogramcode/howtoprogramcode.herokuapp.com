// Share object - Based on Feed, gets share data from the API and binds some buttons.
var events = require( '../helpers/events' );
var Feed = require( './feed' );

var Share = Object.create( Feed, {

  create : {

    value : function ( $el, api, directive ) {

      // Create instance.
      var share = Feed.create.call( this, $el, api, directive );

      // Add elements.
      share.$list = $el.find( '[data-js="share-list"]' );

      // Add data.
      share.api.data.url = $el.data( 'js-url' );

      // Return instance.
      return share;

    }

  },

  bind : {

    value : function () {

      var self = this;
      var open = false;
      
      this.$el.on( 'click', function ( e ) {

        e.preventDefault();

        if ( !open ) {
          events.trigger( 'share.open', [ self.$el, self.$list ] );
          open = true;
        } else {
          events.trigger( 'share.close', [ self.$el, self.$list ] );
          open = false;
        }

      });
    }
  
  },

  start : {

    value : function () {

      var self = this;

      this.fetch().done( function ( response ) {

        self.set( response );
        self.render();
        self.bind();
        self.$deferred.resolve( self );

      }).fail( function () {

        self.$el.remove();
        self.$deferred.resolve( self );

      });
    
      return this.$deferred.promise();

    }

  }

});

module.exports = Share;
