// var _ = require( 'lodash' );
// var $ = require( 'jquery' );
var AbstractModel = require( './Model' );
var io = require( 'socket-io/client' );

class SocketModel extends AbstractModel {
	constructor( attributes, options ) {
		super( attributes, options );
		this.socket = io.socket();
	}
}

module.exports = SocketModel;
