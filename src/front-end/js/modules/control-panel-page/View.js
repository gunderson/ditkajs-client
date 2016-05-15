'use strict';
var $ = require( 'jquery' );
// var _ = require( 'lodash' );
// var io = require( 'socket.io-client' );


// var localIp = '192.168.6.249';
var localIp = GLOBALS.ENV.DOMAINS.api.address;
var localPort = GLOBALS.ENV.DOMAINS.api.serverPort;

// var socket = io( 'http://localhost' );
// socket.on( 'connect', function() {} );
// socket.on('event', function(data) {});
// socket.on('disconnect', function() {});

$( 'button.play' )
	.click( () => $.get( `http://${localIp}:${localPort}/play` ) );
$( 'button.stop' )
	.click( () => $.get( `http://${localIp}:${localPort}/stop` ) );

$( 'input:checkbox' )
	.on( 'change', ( evt ) => {
		let target = evt.target;
		if ( target.checked ) {
			$( 'input:checkbox' )
				.each( ( i, el ) => {
					target.value === i ? el.checked = true : el.checked = false;
				} );
			$.get( `http://${localIp}:${localPort}/led/${target.value}/on` );
		} else {
			$.get( `http://${localIp}:${localPort}/led/${target.value}/off` );
		}
	} );
