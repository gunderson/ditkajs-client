var cp = require( 'child_process' );
var GitWebhooks = require( 'git-web-hooks' );

function start() {
	return new GitWebhooks( {
			PORT: 3333
		} )
		.on( 'payload', ( req, res, payload ) => {
			// do something based on payload contents
			cp.spawn( 'gulp' );
			// then send a response to github
			res.send( 'got it!' );
		} )
}

module.exports = {
	start
}
