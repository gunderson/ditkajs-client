var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	sass = require( 'gulp-sass' ),
	csso = require( 'gulp-csso' ),
	uglify = require( 'gulp-uglify' ),
	babelify = require( 'babelify' ),
	browserify = require( 'browserify' ),
	pug = require( 'gulp-pug' ),
	jstConcat = require( 'gulp-jst-concat' ),
	plumber = require( 'gulp-plumber' ),
	_ = require( 'lodash' ),
	concat = require( 'gulp-concat' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	livereload = require( 'gulp-livereload' ), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
	tinylr = require( 'tiny-lr' ),
	marked = require( 'marked' ), // For :markdown filter in jade
	path = require( 'path' ),
	fs = require( 'fs' ),
	cp = require( 'child_process' ),
	source = require( 'vinyl-source-stream' ),
	buffer = require( 'vinyl-buffer' ),
	rename = require( "gulp-rename" );


var domains = {
	frontEndSettings: {
		domainName: "front-end",
		serverPort: 80,
		lrPort: 35729,
	},
	apiSettings: {
		domainName: "api",
		serverPort: 3000,
		lrPort: 35728,
	},
};

var env = "dev";
var data = {
	env: require( `./src/shared/js/data/env/${env}` )
};

_.each( domains, setupDomainTasks );

var serverProcess;

function setupDomainTasks( domainSettings ) {
	liveReloadServer = tinylr();
	// --- Basic Tasks ---
	gulp.task( `${domainSettings.domainName}-css`, function () {
		return gulp.src( `./src/${domainSettings.domainName}/sass/**/*.sass` )
			.pipe( plumber() )
			.pipe(
				sass( {
					includePaths: [ `./src/${domainSettings.domainName}/sass/` ],
					errLogToConsole: true,
				} ) )
			.pipe( csso() )
			.pipe( gulp.dest( `./dist/${domainSettings.domainName}/` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
	} );

	gulp.task( `${domainSettings.domainName}-js`, function () {
		var b = browserify( {
			entries: [ `./src/${domainSettings.domainName}/js/index.js` ],
			debug: true,
			paths: [ `./src/${domainSettings.domainName}/js/`, './node_modules', `./src/shared/js/` ],
		} );

		return b.bundle()
			.pipe( plumber() )
			.pipe( source( `${domainSettings.domainName}/index.js` ) )
			.pipe( buffer() )
			.pipe( gulp.dest( `./dist/` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log )
	} );

	function listFolders( dir ) {
		return fs.readdirSync( dir )
			.filter( function ( file ) {
				return fs.statSync( path.join( dir, file ) )
					.isDirectory();
			} );
	}

	function listFiles( dir ) {
		return fs.readdirSync( dir )
			.filter( function ( file ) {
				return !fs.statSync( path.join( dir, file ) )
					.isDirectory();
			} );
	}

	gulp.task( `${domainSettings.domainName}-static-templates`, function () {
		var copyPath = "./src/shared/js/data/copy/"
		var langs = listFolders( copyPath );
		var langData = {};
		if ( !langs.length ) throw new Error( "No language folders in ./src/shared/js/data/copy/" );
		var files = listFiles( path.join( copyPath, langs[ 0 ] ) );
		if ( !files.length ) throw new Error( "No data files in ./src/shared/js/data/copy/" + langs[ 0 ] );

		return langs.map( ( lang ) => {
			langData[ lang ] = {};
			_.each( files, ( filename ) => {
				langData[ lang ][ path.basename( filename, ".json" ) ] = require( path.resolve( copyPath, lang, filename ) );
			} );
			return gulp.src( [ `./src/${domainSettings.domainName}/pug/static/**/*.pug`, `!./src/${domainSettings.domainName}/pug/static/**/_*.pug` ] )
				.pipe( plumber() )
				.pipe( rename( function ( path ) {
					path.basename += `.${lang}`;
					path.extname = ".html";
				} ) )
				.pipe( pug( {
					pretty: true,
					locals: {
						data: data,
						copy: langData[ lang ]
					}
				} ) )
				.pipe( gulp.dest( `./dist/${domainSettings.domainName}` ) )
				.pipe( livereload( liveReloadServer ) )
				.on( 'error', gutil.log )
				.on( 'end', () => {
					if ( lang === "en" ) {
						gulp.src( `./dist/${domainSettings.domainName}/index.en.html` )
							.pipe( plumber() )
							.pipe( rename( function ( path ) {
								path.basename = "index";
								path.extname = ".html";
							} ) )
							.pipe( gulp.dest( `./dist/${domainSettings.domainName}` ) )
					}
				} );
		} );

	} );

	gulp.task( `${domainSettings.domainName}-dynamic-templates`, function () {
		var stream = gulp.src( [ `./src/${domainSettings.domainName}/pug/dynamic/**/*.pug`, `!./src/${domainSettings.domainName}/pug/dynamic/**/_*.pug` ] )
			.pipe( plumber() )
			.pipe( pug( {
				pretty: true,
			} ) )
			.pipe( jstConcat( `templates.js` ) )
			.pipe( gulp.dest( `./src/${domainSettings.domainName}/js/` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log )
			.on( 'end', () => gulp.run( `${domainSettings.domainName}-js` ) );

		return stream;
	} );


	gulp.task( `${domainSettings.domainName}-watch`, function () {
		liveReloadServer.listen( domainSettings.lrPort, function ( err ) {
			if ( err ) {
				return console.log( err );
			}
			gulp.watch( `./src/${domainSettings.domainName}/sass/**/*.sass`, [ `${domainSettings.domainName}-css` ] );
			gulp.watch( `./src/${domainSettings.domainName}/js/**/*.js`, [ `${domainSettings.domainName}-js` ] );
			gulp.watch( `./src/${domainSettings.domainName}/jade/static/**/*.jade`, [ `${domainSettings.domainName}-static-templates` ] );
			gulp.watch( `./src/${domainSettings.domainName}/jade/dynamic/**/*.jade`, [ `${domainSettings.domainName}-dynamic-templates` ] );
		} );
	} );

	gulp.task( domainSettings.domainName, [
		`${domainSettings.domainName}-dynamic-templates`,
		`${domainSettings.domainName}-static-templates`,
		`${domainSettings.domainName}-css`,
	] );

}

gulp.task( `main-js`, function () {
	var b = browserify( {
		entries: [ `./src/main.js` ],
		debug: true,
		paths: [ './node_modules', `./src/shared/js/` ],
	} );

	return b.bundle()
		.pipe( plumber() )
		.pipe( source( `main.js` ) )
		.pipe( buffer() )
		.pipe( gulp.dest( `./dist/` ) )
		.pipe( livereload( liveReloadServer ) )
		.on( 'error', gutil.log )
} );

// Default Task
gulp.task( 'default', _.map( domains, ( d ) => `${d.domainName}` ) );
