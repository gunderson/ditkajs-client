var _ = require( 'lodash' );
var TaskPage = require( '../../../../shared/js/TASK/Page' );

class MasterPage extends TaskPage {
	constructor( options ) {

		// ---------------------------------------------------
		// Local Properties

		super( _.extend( {
			name: 'master-page'
		}, options ) );
	}
}

module.exports = MasterPage;
