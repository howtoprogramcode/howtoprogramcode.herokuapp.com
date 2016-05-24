// Widget object - Based on Feed, gets data from an API and creates multiple widgets.

var events = require( '../helpers/events' );
var Feed = require( './feed' );

var Widget = Object.create( Feed, {

  create : {
    value : function ( $el, api, directive ) {

      // Create instance.
      var widget = Feed.create.call( this, $el, api, directive );

      // Return instance.
      return widget;

    }
  },

  trim : {
    value : function ( response ) {

      var data = response[ this.api.source ];
      var count = parseInt( this.api.data.per_page || this.api.data.perpage , 10 );
      var page = this.api.data.page;

      // Dickbutt apis don't allow pagination requests.
      if ( data && data.length > count ) {
        data = data.slice( ( count * page ) - count, count * page );
      }

      return data;

    }
  },

  update : {
    value : function () {

      // Recache $el to be the children, not the parent.
      this.$el = this.$el.find( '[data-js="widget"]' );
      this.$el.selector = '[data-js="widget"]';

    }
  },

  start : {
    value : function () {

      var self = this;

      // Success.
      this.fetch().done( function ( response ) {

        self.set( self.trim( response ) );
        self.render();
        self.update();
        self.$deferred.resolve( self );

      // Fail.
      }).fail( function () {

        self.$el.remove();
        self.$deferred.resolve( self );

      });
    
      return this.$deferred.promise();

    }
  }

});


module.exports = Widget;
