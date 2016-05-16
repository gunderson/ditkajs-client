var _ = require( 'lodash' );
var TaskModel = require( '../../../../shared/js/TASK/Model' );
var page = require( 'page' );

class AppModel extends TaskModel {
	constructor( options ) {
		super( options );

		// ---------------------------------------------------------
		// Local Props

		_.extend( this, {
			prevRoute: null,
			// nonsensical route for boot-up
			_route: {
				parts: [ '!!!!!' ]
			}
		} );

		// ---------------------------------------------------------
		// Bind Functions

		TaskModel.bindFunctions( this, [
			'setupRouter',
			'onRoute'
		] );

		// ---------------------------------------------------------
		// Init chain

		// this.setupRouter();
	}

	// ---------------------------------------------------------
	// Routing

	setupRouter() {
		page.base( '/#' );
		page( '/', '/master' );
		page( '/master', this.onRoute );
		page( '/control-panel', this.onRoute );
		page();
	}

	onRoute( ctx ) {
		// console.log( ctx );
		this.route = ctx;
	}

	// ---------------------------------------------------------
	// Getters & Setters

	get route() {
		return this._route;
	}

	set route( ctx ) {
		// Get constituent parts for use in page-route handling
		ctx.parts = ctx.path
			.slice( 1 )
			.split( '/' );
		this.prevRoute = this._route;
		this._route = ctx;
		this._route.prevRoute = this.prevRoute;

		// console.log( 'ROUTE :: ', this._route );
		this.trigger( 'route', this._route );
		return ctx;
	}
}

module.exports = AppModel;
