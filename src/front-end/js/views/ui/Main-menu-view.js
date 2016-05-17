var _ = require( 'lodash' );
var TaskView = require( '../../../../shared/js/TASK/View' );

class Menu extends TaskView {
	constructor( options ) {

		// ---------------------------------------------------
		// Local Properties

		super( _.extend( {
			el: '#main-menu',
			events: [ {
				eventName: 'click',
				selector: '.handle',
				handler: 'toggleMenu'
			}, {
				eventName: 'click',
				selector: '.closer',
				handler: 'closeMenu'
			} ]
		}, options ) );

		// ---------------------------------------------------
		// Bind Functions

		TaskView.bindFunctions( this, [
			'openMenu',
			'closeMenu',
			'toggleMenu'
		] );
	}

	openMenu( e ) {
		this.$el.addClass( 'menu-open' );
	}

	closeMenu( e ) {
		this.$el.removeClass( 'menu-open' );
	}

	toggleMenu( e ) {
		console.log( this.$el );
		this.$el.toggleClass( 'menu-open' );
	}
}

module.exports = Menu;
