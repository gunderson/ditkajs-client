'use strict';
var _ = require( 'lodash' );
var $ = require( 'jquery' );
var TaskPage = require( '../../../../shared/js/TASK/Page' );

class Page extends TaskPage {
	constructor( options ) {

		// ---------------------------------------------------
		// Local Properties

		super( _.defaults( options, {
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
		} ) );

		// ---------------------------------------------------
		// Bind Functions

		TaskPage.bindFunctions( this, [
			'onClickPlay',
			'onClickStop',
			'onChangeCheckbox'
		] );

		// ---------------------------------------------------
		// Event Handlers

	}

	onClickPlay() {
		APP.play();
	}

	onClickStop() {
		APP.stop();
	}

	onChangeCheckbox( evt ) {
		var target = evt.target;
		if ( target.checked ) {
			this.$( 'input:checkbox' )
				.each( ( i, el ) => {
					target.value === i ? el.checked = true : el.checked = false;
				} );
		} else {
			$.get( `http://${this.localAddress}:${this.localPort}/led/${target.value}/off` );
		}
	}
}

module.exports = Page;
