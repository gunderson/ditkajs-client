var pkg = require( '../package.json' );
require( 'colors' );

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
	.usage( 'Usage: $0 -env [dev|stage|prod]' )
	.showHelpOnFail( false, 'Specify --help for available options' )
	// environment
	.option( 'env', {
		alias: 'environment',
		describe: 'define the deployment target [dev|stage|prod]',
		/* array | boolean | string */
		type: 'string',
		nargs: 1,
		default: 'dev'
	} )
	.argv;

var env = argv.env;

console.log( 'Using environment', env.green );

var GLOBALS = {
	ENV: require( `./shared/js/data/env/${env}` )
};


// ------------------------------------------------------
// front-end server

var FrontEnd = require( './front-end/js/main' );
FrontEnd.start( GLOBALS );


// ------------------------------------------------------
// back-end server

var BackEnd = require( './api/js/main' );
BackEnd.start( GLOBALS );


// ------------------------------------------------------
// Webhook server

var Webhooks = require( './shared/js/HookServer' );
Webhooks.start( GLOBALS );
