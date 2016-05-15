var Events = require( 'backbone-events-standalone' );

class EventEmitter {

}

Events.mixin( EventEmitter.prototype );

module.exports = EventEmitter;
