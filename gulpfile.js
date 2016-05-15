require( 'babelify' );
var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	sass = require( 'gulp-sass' ),
	csso = require( 'gulp-csso' ),
	uglify = require( 'gulp-uglify' ),
	browserify = require( 'browserify' ),
	pug = require( 'gulp-pug' ),
	jstConcat = require( 'gulp-jst-concat' ),
	plumber = require( 'gulp-plumber' ),
	_ = require( 'lodash' ),
	// sourcemaps = require( 'gulp-sourcemaps' ),
	livereload = require( 'gulp-livereload' ), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
	tinylr = require( 'tiny-lr' ),
	// marked = require( 'marked' ), // For :markdown filter in pug
	path = require( 'path' ),
	fs = require( 'fs' ),
	// cp = require( 'child_process' ),
	source = require( 'vinyl-source-stream' ),
	buffer = require( 'vinyl-buffer' ),
	rename = require( 'gulp-rename' ),
	pkg = require( './package.json' );

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
} );

var env = argv.env;

gutil.log( 'Using environment', env );

var GLOBALS = {
	ENV: require( `./src/shared/js/data/env/${env}` )
};

_.each( pkg.domains, setupDomainTasks );

function setupDomainTasks( domainSettings, domainName ) {
	var liveReloadServer = tinylr();
	// --- Basic Tasks ---
	gulp.task( `${domainName}-css`, function() {
		return gulp
			.src( `./src/${domainName}/sass/**/*.sass` )
			.pipe( plumber() )
			.pipe( sass( {
				includePaths: [ `./src/${domainName}/sass/` ],
				errLogToConsole: true
			} ) )
			.pipe( csso() )
			.pipe( gulp.dest( `./dist/${domainName}/` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
	} );

	gulp.task( `${domainName}-js`, [ `${domainName}-static-templates` ], function() {
		var b = browserify( {
			entries: [ `./src/${domainName}/js/index.js` ],
			debug: ( env === 'dev' ),
			paths: [ `./src/${domainName}/js/`, './node_modules', './src/shared/js/' ]
		} );

		return b
			.bundle()
			.pipe( plumber() )
			.pipe( source( `${domainName}/index.js` ) )
			.pipe( buffer() )
			.pipe( ( env === 'dev' ) ? buffer() : uglify() )
			.pipe( gulp.dest( './dist/' ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
	} );

	function listFolders( dir ) {
		return fs
			.readdirSync( dir )
			.filter( function( file ) {
				return fs
					.statSync( path.join( dir, file ) )
					.isDirectory();
			} );
	}

	function listFiles( dir ) {
		return fs
			.readdirSync( dir )
			.filter( function( file ) {
				return !fs
					.statSync( path.join( dir, file ) )
					.isDirectory();
			} );
	}

	gulp
		.task( `${domainName}-static-templates`, function() {
			var copyPath = './src/shared/js/data/copy/';
			var langs = listFolders( copyPath );
			var langData = {};
			if ( !langs.length ) {
				throw new Error( 'No language folders in ./src/shared/js/data/copy/' );
			}
			var files = listFiles( path.join( copyPath, langs[ 0 ] ) );
			if ( !files.length ) {
				throw new Error( 'No data files in ./src/shared/js/data/copy/' + langs[ 0 ] );
			}
			return langs.map( ( lang ) => {
				langData[ lang ] = {};
				_.each( files, ( filename ) => {
					langData[ lang ][ path.basename( filename, '.json' ) ] = require( path.resolve( copyPath, lang, filename ) );
				} );
				GLOBALS.COPY = langData[ lang ];
				return gulp
					.src( [ `./src/${domainName}/pug/static/**/*.pug`, `!./src/${domainName}/pug/static/**/_*.pug` ] )
					.pipe( plumber() )
					.pipe( rename( function( path ) {
						path.basename += `.${lang}`;
						path.extname = '.html';
					} ) )
					.pipe( pug( {
						pretty: true,
						locals: {
							GLOBALS: GLOBALS,
							lang: lang
						}
					} ) )
					.pipe( gulp.dest( `./dist/${domainName}` ) )
					.pipe( livereload( liveReloadServer ) )
					.on( 'error', gutil.log )
					.on( 'end', () => {
						if ( lang === 'en' ) {
							gulp
								.src( `./dist/${domainName}/index.en.html` )
								.pipe( plumber() )
								.pipe( rename( function( path ) {
									path.basename = 'index';
									path.extname = '.html';
								} ) )
								.pipe( gulp.dest( `./dist/${domainName}` ) );
						}
					} );
			} );
		} );

	gulp.task( `${domainName}-dynamic-templates`, function() {
		var stream = gulp
			.src( [ `./src/${domainName}/pug/dynamic/**/*.pug`, `!./src/${domainName}/pug/dynamic/**/_*.pug` ] )
			.pipe( plumber() )
			.pipe( pug( {
				pretty: true
			} ) )
			.pipe( rename( function( path ) {
				path.dirname = 'home';
				path.extname = '';
				path.relative = true;
			} ) )
			.pipe( jstConcat( 'templates.js' ) )
			.pipe( gulp.dest( `./src/${domainName}/js/` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
		return stream;
	} );

	// TODO: process assets
	gulp.task( `${domainName}-copy-assets`, function() {
		return gulp
			.src( `./src/${domainName}/assets/**/*` )
			.pipe( plumber() )
			.pipe( gulp.dest( `./src/${domainName}/assets/` ) )
			.on( 'error', gutil.log );
	} );

	gulp.task( `${domainName}-watch`, function() {
		liveReloadServer
			.listen( domainSettings.lrPort, function( err ) {
				if ( err ) {
					return console.log( err );
				}
				gulp.watch( `./src/${domainName}/sass/**/*.sass`, [ `${domainName}-css` ] );
				gulp.watch( `./src/${domainName}/js/**/*.js`, [ `${domainName}-js` ] );
				gulp.watch( `./src/${domainName}/jade/static/**/*.pug`, [ `${domainName}-static-templates` ] );
				gulp.watch( `./src/${domainName}/jade/dynamic/**/*.pug`, [ `${domainName}-js` ] );
			} );
	} );

	gulp.task( `${domainName}-main`, function() {
		var b = browserify( {
			entries: [ `./src/${domainName}/js/main.js` ],
			debug: true,
			bare: true,
			paths: [ './node_modules', './src/shared/js/' ]
		} );

		return b
			.bundle()
			.pipe( plumber() )
			.pipe( source( 'main.js' ) )
			.pipe( buffer() )
			.pipe( gulp.dest( './dist/' ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
	} );

	gulp.task( domainName, [ `${domainName}-js`, `${domainName}-static-templates`, `${domainName}-css`, `${domainName}-main` ] );

}

gulp
	.task( 'copy-start', function() {
		return gulp
			.src( './src/start.js' )
			.pipe( plumber() )
			.pipe( gulp.dest( './dist/' ) )
			.on( 'error', gutil.log );
	} );

// Default Task
gulp.task( 'default', [ 'copy-start' ].concat( _.map( pkg.domains, ( d, domainName ) => `${domainName}` ) ) );
