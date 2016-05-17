'use strict';
var TASK = require( '../../shared/js/TASK/TASK' );
var log = require( '../../shared/js/TASK/utils/log' );
var _ = require( 'lodash' );
var express = require( 'express' );
var HeaderUtils = require( './utils/HeaderUtils' );
var logger = require( 'morgan' );
var chalk = require( 'chalk' );

class Server extends TASK {
	constructor( GLOBALS ) {
		super();
		var app = express();

		var router = express.Router();
		router.use( logger( 'dev' ) );

		router.route( '/' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( req.params );
				next();
			} );

		router.route( '/led/:id/:state' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( _.pick( req.params, [ 'id', 'state' ] ) );
				this.trigger( 'led', req.params );
			} );

		router.route( '/play' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( {
					play: true
				} );
				this.trigger( 'play', req.params.id );
			} );

		router.route( '/stop' )
			.get( ( req, res, next ) => {
				HeaderUtils.addJSONHeader( res );
				HeaderUtils.addCORSHeader( res );
				res.send( {
					stop: true
				} );
				this.trigger( 'stop', req.params.id );
			} );

		app.use( '/', router );
		log( chalk.green( 'Device server:' ), 'Starting', __dirname );
		app.listen( GLOBALS.ENV.DOMAINS.device.port, function() {
			log( chalk.green( 'Device server' ), 'listening on port:', chalk.green( `${GLOBALS.ENV.DOMAINS.device.port}` ) );
		} );
	}
}

module.exports = Server;
