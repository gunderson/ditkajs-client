var _ = require( "lodash" );
var Emitter = require( "backbone-events-standalone" );
var AbstractModel = require( "AbstractModel" );

class Collection extends Emitter {
	var _models, _options;

	constructor( models, options ) {
		_options = _.extend( {
			model: AbstractModel,
			url: null,
		}, options );

		_models = [];
		reset( models );
	}

	// ---------------------------------------------------

	[ Symbol.iterator ]() {
		return _models.values()
	}

	// ---------------------------------------------------

	reset( models, options ) {
		options = options || {};
		// kill existing models
		this.empty();
		// create new models
		_.each( models, ( m ) => this.add( m, options ) );
		if ( !options.silent ) {
			this.trigger( "reset", this );
		}
		return this;
	}

	// ---------------------------------------------------

	set( models, options ) {
		options = options || {};
		models = _.isArray( models ) ? models : [ models ];
		_.each( models, ( attributes ) => {
			var model = this.get( attributes.id );
			if ( model ) {
				// if the model exists, update it's attributes
				model.set( attributes );
			} else {
				// otherwise, add it
				this.add( attributes );
			}

		} );
		return this;
	}

	// ---------------------------------------------------

	add( models, options ) {
		options = options || {};
		//if models isn't an array, make it one
		models = _.isArray( models ) ? models : [ models ];
		var updated = _.map( models, ( attributes ) => {
			// create new models
			if ( attributes.id ) {
				var existingModel = this.get( attributes.id );
				if ( existingModel ) {
					if ( options.merge ) {
						// update other model
						existingModel.set( attributes );
						// we're done here
						return existingModel;
					} else {
						// remove other model
						this.remove( existingModel );
					}
				}
			} else {
				// create a unique id
				attributes.id = _.unique();
			}
			// create new model
			var m = new _options.model( attributes );
			// register in list
			_models.push( m );
			// listen to them
			m.on( "change", forwardChangeEvent );

			if ( !options.silent ) {
				this.trigger( "add", m );
			}
			return m;
		} );
		// sort the models
		if ( _options.sort ) {
			_models = _models.sort( _options.sort );
			updated = updated.sort( _options.sort );
		}
		return updated;
	}

	// ---------------------------------------------------

	remove( models, options ) {
		options = options || {};
		//if models isn't an array, make it one
		models = _.isArray( models ) ? models : [ models ];
		_.each( models, ( m ) => {
			// allow ids to be passed
			if ( typeof model !== "object" ) {
				model = this.get( model );
			}
			var index = _models.indexOf( model );
			if ( index > -1 ) {
				this.off( model );
				_models.splice( index, 1 );
				if ( !options.silent ) {
					this.trigger( "remove", model );
				}
			}
		} )
		return this;
	}

	// ---------------------------------------------------

	empty( options ) {
		this.remove( _models, options );
	}

	// ---------------------------------------------------

	get( matchConditions ) {
		// make sure match conditions is an array
		matchConditions = _.isArray( matchConditions ) ? matchConditions : [ matchConditions ];

		// an array of objects is assumed to be a list of match condition objects
		// an array of non-objects is assumed to be a list of ids
		if ( typeof matchConditions[ 0 ] !== "object" ) {
			// convert to match condition objects
			matchConditions = _.map( matchConditions, ( id ) => {
				return {
					id
				};
			} );
		}

		var models = _( matchConditions )
			// for each condition, find a list of models that matches
			.map( ( condition ) => {
				return _.filter( _models, condition );
			} )
			.flattten()
			// only include models once in list
			.uniq()
			.value();

		if ( models.length === 1 ) {
			return models[ 0 ];
		} else {
			return models;
		}
	}

	// ---------------------------------------------------

	at( index ) {
		return _models[ index ];
	}

	// ---------------------------------------------------

	fetch( options ) {
		options = options || {};
		// default fetch action is to merge from json api
		// to reset set options.reset = true
	}

	// ---------------------------------------------------

	forwardChangeEvent( data ) {
		this.trigger( "change", _.extend( {
			collection: this
		}, data ) );
		return this;
	}

	// ---------------------------------------------------

	toJSON() => _.map( _models, ( m ) => m.toJSON() );

	// ---------------------------------------------------

	get length() {
		return _models.length;
	}

	get models() {
		return _models;
	}

	// ---------------------------------------------------

	set sortBy( attr ) {
		options.sort = ( a, b ) => b[ attr ] - a[ attr ];
		return attr;
	}

}
