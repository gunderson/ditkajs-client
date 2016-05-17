'use strict';
var pkg = require( '../../package.json' );

var Server = require( './js/server' );
var Robot = require( './js/robot' );

// ----------------------------------------------------------------
// CLI

var argv = require( 'yargs' )
	.epilog( 'copyright 2015' )
	// version
	.alias( 'v', 'version' )
	.version( function() {
		return pkg.version;
	} )
	.describe( 'v', 'show version information' )
	// help text
	.alias( 'h', 'help' )
	.help( 'help' )
	.usage( 'Usage: $0 [options]' )
	.showHelpOnFail( false, 'Specify --help for available options' )
	// environment
	.option( 'env', {
		alias: 'environment',
		describe: 'define the deployment target [ dev | stage | prod ]',
		type: 'string',
		nargs: 1,
		default: 'dev'
	} )
	.argv;

var env = argv.env;

var GLOBALS = {
	ENV: require( `../shared/js/data/env/${env}` )
};

var apiServer = new Server( GLOBALS );
var robot = new Robot( GLOBALS );

// tie the interfaces together using events
apiServer.on( 'led', robot.led );
apiServer.on( 'play', robot.play );
apiServer.on( 'stop', robot.stop );
