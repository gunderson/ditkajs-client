'use strict';
// var _ = require( 'lodash' );
var TASK = require( '../../shared/js/abstract/TASK' );
var bodyParser = require( 'body-parser' );
var express = require( 'express' );
// var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var methodOverride = require( 'method-override' );
var path = require( 'path' );
require( 'colors' );

class Server extends TASK {
	constructor( GLOBALS ) {
		super();
		var app = express();
		app.set( 'env', 'development' );
		app.use( express.static( path.resolve( __dirname, '../' ) ) );
		console.log( 'FRONT END SERVER', path.resolve( __dirname, '../' ) );

		// ---------------------------------------------------------

		var router = express.Router();
		router.use( logger( 'dev' ) );
		router.use( methodOverride() );
		// parse application/x-www-form-urlencoded
		router.use( bodyParser.urlencoded( {
			extended: false
		} ) );
		// parse application/json
		router.use( bodyParser.json() );

		// ---------------------------------------------------------

		app.use( '/', router );
		app.listen( GLOBALS.ENV.DOMAINS[ 'front-end' ].serverPort, function() {
			console.log( 'Front-end server listening on port:', `${GLOBALS.ENV.DOMAINS[ 'front-end' ].serverPort}`.green, path.resolve( __dirname, '../../../dist/front-end/' ) );
		} );
	}
}

module.exports = Server;
