'use strict';
var Server = require( './server' );

function start( GLOBALS ) {
	var frontEndServer = new Server( GLOBALS );
}

module.exports = {
	start
};
