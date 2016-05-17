'use strict';
// var _ = require( 'lodash' );
var cp = require( 'child_process' );
var TASK = require( '../../shared/js/TASK/TASK' );
var log = require( '../../shared/js/TASK/utils/log' );
var chalk = require( 'chalk' );
var fs = require( 'fs' );
var https = require( 'https' );
var Q = require( 'q' );

class Service extends TASK {
	constructor( GLOBALS ) {
		super();
		log( chalk.green( 'autoupdate server' ), 'starting', __dirname );

		this.localSha = fs.readFileSync( '../../../.git/ORIG_HEAD', 'utf-8', ( err ) => {
			if ( err ) {
				// we don't have a local repo
				// make a git repo
				// add the remote origin
				// pull repo
				this.localSha = '';
			}
		} );

		log( chalk.green( 'autoupdate service' ), 'polling every:', chalk.green( `${GLOBALS.pkg.domains.autoupdate.pollFrequency} ms` ) );
	}

	start() {

	}

	static pollGit() {
		log( chalk.green( 'autoupdate server' ), 'checking version' );
		var def = Q.defer();
		var options = {
			hostname: GLOBALS.pkg.domains.autoupdate.remoteAddress,
			port: 443,
			path: GLOBALS.pkg.domains.autoupdate.remotePath,
			method: 'GET',
			headers: {
				'user-agent': 'nodejs autoupdate ping'
			}
		};

		var req = https.request( options, ( res ) => {
			var data = [];
			res.on( 'data', ( chunk ) => data.push( chunk ) );
			res.on( 'end', () => def.resolve( JSON.parse( data.toString() ) ) );
		} );

		req.end();

		req.on( 'error', ( e ) => {
			log( chalk.red( 'autoupdate error:' ), e );
		} );
		return def;
	}

	onReply( data ) {
		var remoteSha = data[ 0 ].sha;
		if ( this.localSha !== remoteSha ) {
			// get the latest
		}
	}

	getLatest() {

	}

	onDownloadComplete() {

	}

	prepFiles() {

	}

	onPrepFilesComplete() {

	}

	restartApplication() {

	}
}

module.exports = Service;
