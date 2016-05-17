var _ = require( 'lodash' );
var $ = require( 'jquery' );
var TaskModel = require( '../../../shared/js/TASK/Model' );
var page = require( 'page' );

class AppModel extends TaskModel {
	constructor( options ) {
		super( options );

		// ---------------------------------------------------------
		// Local Props

		console.log( this.prototype );
		console.log( this );

		_.extend( this, {
			prevRoute: null,
			_route: {
				parts: [ 'bootstrap route' ]
			},
			deviceAddress: this.GLOBALS.ENV.DOMAINS.device.address,
			devicePort: this.GLOBALS.ENV.DOMAINS.device.port
		} );

		// ---------------------------------------------------------
		// Bind Functions

		TaskModel.bindFunctions( this, [
			'setupRouter',
			'setupSocket',
			'onRoute'
		] );

		// ---------------------------------------------------------
		// Init chain

		// this.setupRouter();
		// this.setupSocket();
	}

	// ---------------------------------------------------------
	// Controls

	play() {
		return $.get( `http://${this.deviceAddress}:${this.devicePort}/play` );
	}

	stop() {
		return $.get( `http://${this.deviceAddress}:${this.devicePort}/stop` );
	}

	setLed( id, state ) {
		return $.get( `http://${this.deviceAddress}:${this.devicePort}/led/${id}/${state}` );
	}

	// ---------------------------------------------------------
	// Routing

	setupSocket() {
		// this.socket = io( `http://${this.localAddress}` );
		// this.socket.on( 'connect', function() {} );
		// this.socket.on( 'event', function( data ) {} );
		// this.socket.on( 'disconnect', function() {} );
	}

	setupRouter( routes ) {
		page.base( '/#' );
		page( '/', `/${routes[0]}` );
		_.each( routes, ( route ) => {
			page( `/${route}`, this.onRoute );
		} );
		page( '*', `/${routes[0]}` );
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
