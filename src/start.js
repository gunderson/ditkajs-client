/* eslint indent:0 no-unused-vars:0*/

var _ = require( 'lodash' );
var pkg = require( '../package.json' );
var chalk = require( 'chalk' );
var log = require( './shared/js/TASK/utils/log' );
var cp = require( 'child_process' );
var path = require( 'path' );
var fs = require( 'fs' );

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
		default: [ 'device', 'front-end', 'webhooks', 'autoupdate' ]
	} )
	.argv;

var env = argv.env;
var runDomains = argv.d;

log( chalk.green( '----' ), 'STARTING APPLICATION', chalk.green( '----' ) );
log( chalk.green( 'Starting domains:' ), runDomains );
log( chalk.green( 'Using environment:' ), env );

// var GLOBALS = {
// 	ENV: require( `./shared/js/data/env/${env}` )
// };

// ------------------------------------------------------
// start domains

var startedDomainsProcesses = _( pkg.domains )
	.pick( runDomains )
	.map( ( domain, domainName ) => {
		var processPath = path.resolve( __dirname, domainName );
		var process = cp.fork( path.resolve( processPath, 'start' ), [ '--env', env ], {
				cwd: processPath
			} )
			.on( 'message', ( message ) => {
				log( chalk.yellow( domainName ), message );
				if ( message === 'restart' ) {
					restartApplication();
				}
			} );

		process.domainName = domainName;

		return process;
	} )
	.value();

function restartApplication() {
	log( chalk.red( '----' ), 'KILLING APPLICATION', chalk.red( '----' ) );

	_.each( startedDomainsProcesses, ( process ) => {
		log( chalk.red( 'Killing domain:' ), process.domainName );
		process.kill();
	} );

	log( chalk.yellow( '----' ), 'RESTARTING APPLICATION', chalk.yellow( '----' ) );
	var child = cp.spawn( 'npm', [ 'start' ], {
		detached: true,
		stdio: 'ignore'
	} );

	child.unref();
	child = null;
	process.exit();
}
