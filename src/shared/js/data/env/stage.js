var defaults = require( './default.js' ),
	_ = require( 'lodash' );

module.exports = _.defaults( defaults, {
	'name': 'stage',
	DOMAINS: {
		'front-end': {
			address: '10.0.1.8'
		},
		'api': {
			address: '10.0.1.8'
		}
	}
} );
