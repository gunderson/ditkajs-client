'use strict';
var EventEmitter = require( '../../shared/js/abstract/EventEmitter' );
var _ = require( 'lodash' );
var express = require( 'express' );
var HeaderUtils = require( './utils/HeaderUtils' );
var logger = require( 'morgan' );
require( 'colors' );

class Server extends EventEmitter {
	constructor( GLOBALS ) {
		super();
		var app = express();

		var router = express.Router();
		router.use( logger( 'dev' ) );

		app.route( '/' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( req.params );
				next();
			} );

		app.route( '/led/:id/:state' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( _.pick( req.params, [ 'id', 'state' ] ) );
				this.trigger( 'led', req.params );
			} );

		app.route( '/play' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( {
					play: true
				} );
				this.trigger( 'play', req.params.id );
			} );

		app.route( '/stop' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( {
					stop: true
				} );
				this.trigger( 'stop', req.params.id );
			} );

		app.listen( GLOBALS.ENV.DOMAINS.api.serverPort, function() {
			console.log( 'API server listening on port', `${GLOBALS.ENV.DOMAINS.api.serverPort}`.green );
		} );
	}
}

module.exports = Server;
