var defaults = require( './default.js' ),
	_ = require( 'lodash' );

module.exports = _.defaults( defaults, {
	'name': 'prod',
	DOMAINS: {
		'front-end': {
			address: '10.0.1.14'
		},
		'api': {
			address: '10.0.1.14'
		}
	}
} );
