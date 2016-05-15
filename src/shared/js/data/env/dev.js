var defaults = require( './default.js' ),
	_ = require( 'lodash' );

module.exports = _.merge( defaults, {
	'name': 'dev',
	DOMAINS: {
		'front-end': {
			address: '10.0.1.8'
		},
		'api': {
			address: '10.0.1.8'
		}
	}
} );
