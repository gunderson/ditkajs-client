'use strict';
// var _ = require( 'lodash' );
var cp = require( 'child_process' );
var TASK = require( '../../shared/js/TASK/TASK' );
var log = require( '../../shared/js/TASK/utils/log' );
var chalk = require( 'chalk' );
var GitWebhooks = require( 'git-web-hooks' );

class Server extends TASK {
	constructor( GLOBALS ) {
		super();
		log( chalk.green( 'Front-end server' ), 'starting', __dirname );

		this.webserver = new GitWebhooks( {
				PORT: 3333
			} )
			.on( 'payload', ( req, res, payload ) => {
				// do something based on payload contents
				cp.spawn( 'gulp' );
				// then send a response to github
				res.send( 'got it!' );
			} );
		log( chalk.green( 'Webhook server' ), 'listening on port:', chalk.green( `${GLOBALS.ENV.DOMAINS.webhooks.port}` ) );

	}
}

module.exports = Server;
