var _ = require( 'lodash' );
var pkg = require( '../package.json' );
var chalk = require( 'chalk' );
var log = require( './shared/js/TASK/utils/log' );
var cp = require( 'child_process' );
var path = require( 'path' );

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
	// domains to start
	.option( 'd', {
		alias: 'domain',
		describe: 'limit startup to certain domains',
		type: 'array',
		nargs: 1,
		default: [ 'device', 'front-end', 'webhooks' ]
	} )
	.argv;

var env = argv.env;
var runDomains = argv.d;

log( chalk.green( '----' ), 'STARTING APPLICATION', chalk.green( '----' ) );
log( 'Starting domains:', chalk.green( runDomains ) );
log( 'Using environment:', chalk.green( env ) );

// var GLOBALS = {
// 	ENV: require( `./shared/js/data/env/${env}` )
// };

// ------------------------------------------------------
// start domains

var startedDomains = _( pkg.domains )
	.pick( runDomains )
	.map( ( domain, domainName ) => {
		var processPath = path.resolve( __dirname, domainName );
		return cp.fork( path.resolve( processPath, 'start' ), [ '--env', env ], {
				cwd: processPath
			} )
			.on( 'message', ( message ) => {
				log( chalk.yellow( domainName ), message );
			} );
	} )
	.value();
