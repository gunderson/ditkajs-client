var frontEnd = require( './front-end/main' );
var apiServer = require( './api/main' );
var cp = require( "child_process" );
var GitWebhooks = require( 'git-web-hooks' )

new GitWebhooks( {
		PORT: 3333 // optional. 3333 is default
	} )
	.on( 'payload', ( req, res, payload ) => {
		// do something based on payload contents
		cp.spawn( "gulp" );
		// then send a response to github
		res.send( 'got it!' );
	} )
