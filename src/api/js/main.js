'use strict';
var Server = require( './server' );
var Robot = require( './robot' );

function start( GLOBALS ) {
	var apiServer = new Server( GLOBALS );
	var robot = new Robot( GLOBALS );

	apiServer.on( 'led', robot.led );
	apiServer.on( 'play', robot.play );
	apiServer.on( 'stop', robot.stop );
}

module.exports = {
	start
};
