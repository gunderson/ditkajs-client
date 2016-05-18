'use strict';
var pkg = require( '../../package.json' );
var Server = require( './js/server' );
var cli = require( './cli' );

var env = cli.env;

var GLOBALS = {
	ENV: require( `../shared/js/data/env/${cli.env}` )
};

var server = new Server( GLOBALS ); // eslint-disable-line no-unused-vars
