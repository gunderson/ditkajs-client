"use strict";
var BackboneEvents = require( "backbone-events-standalone" );
var _ = require( "lodash" );
var bodyParser = require( "body-parser" );
var express = require( "express" );
var favicon = require( "serve-favicon" );
var logger = require( "morgan" );
var methodOverride = require( "method-override" );
var path = require( "path" );

//---------------------------------------------------------

var app = express();
app = _.extend( app, BackboneEvents );
app.set( "env", "development" );
app.use( express.static( path.resolve( __dirname, "../../../dist/front-end/" ) ) );

//---------------------------------------------------------

var router = express.Router();
router.use( logger( 'dev' ) );
router.use( methodOverride() );
// parse application/x-www-form-urlencoded
router.use( bodyParser.urlencoded( {
	extended: false,
} ) );
// parse application/json
router.use( bodyParser.json() );

//---------------------------------------------------------

app.use( '/', router );
app.listen( 80, function () {
	console.log( 'Front-end server listening on port 80!', path.resolve( __dirname, "../../../dist/front-end/" ) );
} );

module.exports = app;
