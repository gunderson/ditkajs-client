var _ = require( 'lodash' );
var TaskPage = require( '../../../shared/js/TASK/Page' );
var MainMenuView = require( './ui/Main-menu-view' );
var MasterPageView = require( './pages/Master-page-view' );
var ControlPanelPageView = require( './pages/Control-panel-page-view' );

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
			views: [].concat( uiViews, pageViews )
		}, options ) );

		this.pageViews = pageViews;

		// ---------------------------------------------------
		// Event Handling

		this.listenTo( this.model, 'route', this.onRoute );
	}
}

module.exports = AppPage;
