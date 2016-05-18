'use strict';
var pkg = require( '../../package.json' );
var Server = require( './js/server' );
var Robot = require( './js/robot' );
var cli = require( './cli' );

var GLOBALS = {
	ENV: require( `../shared/js/data/env/${cli.env}` )
};

var apiServer = new Server( GLOBALS );
var robot = new Robot( GLOBALS );

// tie the interfaces together using events
apiServer.on( 'led', robot.led );
apiServer.on( 'play', robot.play );
apiServer.on( 'stop', robot.stop );
apiServer.on( 'update', process.send( 'autoupdate' ) );

// TODO: send out a push-notification registration request to Ditka server
