'use strict';
var _ = require( 'lodash' );
var $ = require( 'jquery' );
// var io = require( 'socket.io-client' );
var TaskPage = require( '../../../../shared/js/TASK/Page' );

class Page extends TaskPage {
	constructor( options ) {

		// ---------------------------------------------------
		// Local Properties

		super( _.extend( {
			name: 'control-panel-page',
			events: [ {
				eventName: 'click',
				selector: 'button.play',
				handler: 'onClickPlay'
			}, {
				eventName: 'click',
				selector: 'button.stop',
				handler: 'onClickStop'
			}, {
				eventName: 'change',
				selector: 'input:checkbox',
				handler: 'onChangeCheckbox'
			} ]
		}, options ) );

		_.extend( this, {
			serverAddress: this.GLOBALS.ENV.DOMAINS.api.address,
			serverPort: this.GLOBALS.ENV.DOMAINS.api.serverPort
		} );

		// ---------------------------------------------------
		// Bind Functions

		TaskPage.bindFunctions( this, [
			'setupSocket',
			'onClickPlay',
			'onClickStop',
			'onChangeCheckbox'
		] );

		// ---------------------------------------------------
		// Event Handlers

		this.setupSocket();

	}

	setupSocket() {
		// this.socket = io( `http://${this.localAddress}` );
		// this.socket.on( 'connect', function() {} );
		// this.socket.on( 'event', function( data ) {} );
		// this.socket.on( 'disconnect', function() {} );
	}

	onClickPlay() {
		return $.get( `http://${this.localAddress}:${this.localPort}/play` );
	}

	onClickStop() {
		return $.get( `http://${this.localAddress}:${this.localPort}/stop` );
	}

	onChangeCheckbox( evt ) {
		var target = evt.target;
		if ( target.checked ) {
			this.$( 'input:checkbox' )
				.each( ( i, el ) => {
					target.value === i ? el.checked = true : el.checked = false;
				} );
			$.get( `http://${this.localAddress}:${this.localPort}/led/${target.value}/on` );
		} else {
			$.get( `http://${this.localAddress}:${this.localPort}/led/${target.value}/off` );
		}
	}
}

module.exports = Page;
