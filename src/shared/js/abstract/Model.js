var _ = require( 'lodash' );
var $ = require( 'jquery' );
var EventEmitter = require( './EventEmitter' );

class Model extends EventEmitter {
	constructor( attributes, options ) {
		super();
		this._collections = [];

		this._options = _.extend( {
			'toJSONRefs': false,
			'omitAttributes': []
		}, options );

		this._attributes = _.defaults( attributes, {
			id: _.uniqueId(),
			url: null
		} );
		this._attributes.forEach( this.makeAttribute );
	}

	[ Symbol.iterator ]() {
		return this._attributes.values();
	}

	// ---------------------------------------------------

	fetch() {
		return $.get();
	}

	// ---------------------------------------------------

	save() {

	}

	// ---------------------------------------------------

	toJSON( justId ) {
		if ( justId ) return this._attributes.id;

		return _( this._attributes )
			.omit( this._options.omitAttributes )
			.cloneDeepWith( ( a ) => {
				// pass toJSONRefs to tell collections that may be children of this model whether to
				// save their children as objects or just IDs that can be picked up as references from a master collection
				if ( a.toJSON ) return a.toJSON( this._options.toJSONRefs );
			} )
			.value();
	}

	// ---------------------------------------------------

	addToCollection( collection, options ) {
		if ( this._collections.indexOf( collection ) === -1 ) {
			this._collections.push( collection );

			// create listeners on collection for attribute changes
			_.each( this._attributes, ( val, key ) => {
				collection.listenTo( this, `change:${key}`, collection.forwardEvent );
			} );

			// only trigger if model is not already a member
			if ( !options.silent ) {
				this.trigger( 'addToCollection', {
					collection: collection,
					model: this
				} );
			}
		}
		return this;
	}

	// ---------------------------------------------------

	removeFromCollection( collection, options ) {
		if ( this._collections.indexOf( collection ) > -1 ) {
			this._collections.splice( this._collections.indexOf( collection ), 1 );
			// only trigger if model is a member
			if ( !options.silent ) {
				this.trigger( 'removeFromCollection', {
					collection: collection,
					model: this
				} );
			}
		}
		return this;
	}

	// ---------------------------------------------------

	destroy() {
		this.stopListening();
		this._collections = [];
		this._attributes = [];
		this.trigger( 'destroy', this );
		return this;
	}

	// ---------------------------------------------------

	makeAttribute( value, name ) {
		_.each( this._collections, ( c ) => {
			// create forwarder on collection for attribute
			c.listenTo( this, `change:${name}`, c.forwardEvent );
		} );
		Object.defineProperty( this, name, {
			set: ( val ) => {
				this._attributes[ name ] = val;
				var data = {
					model: this,
					name: name,
					value: val,
					type: `change change:${name}`
				};
				this.trigger( data.type, data );

				// if it is an emitter, listen for change events
				if ( _.isFunction( val.trigger ) ) {
					this.listenTo( val, 'change', this.forwardEvent );
				}
			},
			get: () => this._attributes[ name ]
		} );
	}

	// ---------------------------------------------------

	forwardEvent( data ) {
		if ( data.forward === false ) return this;
		data.parents = data.parents || [];
		data.parents.push( this );
		this.trigger( data.type, data );
		return this;
	}

	// ---------------------------------------------------

	get attributes() {
		return this._attributes;
	}
}

module.exports = Model;
