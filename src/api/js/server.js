"use strict";
var BackboneEvents = require( "backbone-events-standalone" );
var _ = require( "lodash" );
var express = require( "express" );
var HeaderUtils = require( "./utils/HeaderUtils" );
var logger = require( "morgan" );

var app = express();
app = _.extend( app, BackboneEvents );

var router = express.Router();
router.use( logger( 'dev' ) );

app.route( '/' )
	.get( function ( req, res, next ) {
		HeaderUtils.addJSONHeader( res );
		HeaderUtils.addCORSHeader( res );
		res.send( req.params );
		next();
	} );

app.route( '/led/:id/:state' )
	.get( function ( req, res, next ) {
		HeaderUtils.addJSONHeader( res );
		HeaderUtils.addCORSHeader( res );
		res.send( _.pick( req.params, [ "id", "state" ] ) );
		app.trigger( "led", req.params );
	} );

app.route( '/play' )
	.get( function ( req, res, next ) {
		HeaderUtils.addJSONHeader( res );
		HeaderUtils.addCORSHeader( res );
		res.send( {
			play: true,
		} );
		app.trigger( "play", req.params.id );
	} );

app.route( "/stop" )
	.get( function ( req, res, next ) {
		HeaderUtils.addJSONHeader( res );
		HeaderUtils.addCORSHeader( res );
		res.send( {
			stop: true,
		} );
		app.trigger( "stop", req.params.id );
	} );

app.listen( 3000, function () {
	console.log( 'API server listening on port 3000!' );
} );

module.exports = app;
