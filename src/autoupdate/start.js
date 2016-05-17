var pkg = require( '../../package.json' );
var Service = require( './js/Service' );

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
	ENV: require( `../shared/js/data/env/${env}` ),
	pkg: pkg
};

var service = new Service( GLOBALS );
