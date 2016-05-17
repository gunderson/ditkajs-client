var fs = require( 'fs' );
var https = require( 'https' );

var localSha = fs.readFileSync( '../../../.git/ORIG_HEAD', 'utf-8', ( err ) => {
	if ( err ) {
		// we don't have a local repo
		// make a git repo
		// add the remote origin
	}
} );

function pollGit() {
	console.log( ( 'autoupdate server' ), 'checking version' );

	var options = {
		hostname: "api.github.com",
		port: 443,
		path: "/repos/gunderson/rpi3-lighthub-resin/commits",
		method: 'GET',
		headers: {
			"user-agent": "nodejs autoupdate ping"
		}
	};

	var req = https.request( options, ( res ) => {
		var data = []
		res.on( 'data', ( chunk ) => data.push( chunk ) );
		res.on( 'end', () => onReply( data.toString() ) );
	} );

	req.end();

	req.on( 'error', ( e ) => {
		console.log( ( 'autoupdate error:' ), e );
	} );
}

function onReply( data ) {
	try {
		var remoteSha = data.sha;
	} catch ( e ) {
		console.log( ( 'autoupdate error:' ), e );
		return;
	}
	if ( localSha !== remoteSha ) {
		// get the latest
	}
}

pollGit();
