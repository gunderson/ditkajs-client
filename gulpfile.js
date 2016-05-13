var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	sass = require( 'gulp-sass' ),
	csso = require( 'gulp-csso' ),
	uglify = require( 'gulp-uglify' ),
	babelify = require( 'babelify' ),
	browserify = require( 'browserify' ),
	jade = require( 'gulp-jade' ),
	plumber = require( 'gulp-plumber' ),
	_ = require( 'lodash' ),
	concat = require( 'gulp-concat' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	livereload = require( 'gulp-livereload' ), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
	tinylr = require( 'tiny-lr' ),
	marked = require( 'marked' ), // For :markdown filter in jade
	path = require( 'path' ),
	cp = require( 'child_process' ),
	source = require( 'vinyl-source-stream' ),
	buffer = require( 'vinyl-buffer' );

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

	gulp.task( `${domainSettings.domainName}-static-templates`, function () {
		return gulp.src( `./src/${domainSettings.domainName}/jade/static/index.jade` )
			.pipe( plumber() )
			.pipe( jade( {
				pretty: true,
			} ) )
			.pipe( gulp.dest( `./dist/${domainSettings.domainName}` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
	} );

	gulp.task( `${domainSettings.domainName}-dynamic-templates`, function () {
		return gulp.src( `./src/${domainSettings.domainName}/jade/dynamic/**/*.jade` )
			.pipe( plumber() )
			.pipe( jade( {
				pretty: true,
			} ) )
			.pipe( gulp.dest( `./dist/${domainSettings.domainName}` ) )
			.pipe( livereload( liveReloadServer ) )
			.on( 'error', gutil.log );
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
		`${domainSettings.domainName}-js`,
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
