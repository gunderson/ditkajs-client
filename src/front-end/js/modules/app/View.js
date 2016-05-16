var _ = require( 'lodash' );
var TaskPage = require( '../../../../shared/js/TASK/Page' );
var MainMenuView = require( '../ui/Main-menu-view' );
var MasterPageView = require( '../master-page/View' );
var ControlPanelPageView = require( '../control-panel-page/View' );

class AppPage extends TaskPage {
	constructor( options ) {

		// ---------------------------------------------------
		// Local Properties

		var uiViews = [
			new MainMenuView()
		];

		var pageViews = [
			new MasterPageView( {
				col: 0,
				row: 0
			} ),
			new ControlPanelPageView( {
				col: 1,
				row: 0
			} )
		];

		super( _.extend( {
			name: 'app-page',
			views: uiViews.concat( pageViews )
		}, options ) );

		// ---------------------------------------------------
		// Event Handling

		this.listenTo( this.model, 'route', this.onRoute );
	}
}

module.exports = AppPage;
