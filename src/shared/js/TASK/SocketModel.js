// var _ = require( 'lodash' );
// var $ = require( 'jquery' );
var TaskModel = require( './Model' );
var io = require( 'socket-io/client' );

class SocketModel extends TaskModel {
	constructor( attributes, options ) {
		super( attributes, options );
		this.socket = io.socket();
	}
}

module.exports = SocketModel;
