"use strict";
var $ = require( "jquery" );
var _ = require( "lodash" );
var io = require( "socket.io-client" );

// var io = require("socket.io-client");

// var socket = io('http://localhost');
// socket.on('connect', function() {});
// socket.on('event', function(data) {});
// socket.on('disconnect', function() {});

// var localIp = "192.168.6.249";
var localIp = "10.0.1.8";
var localPort = "3000";

$( "button.play" )
	.click( () => $.get( `http://${localIp}:${localPort}/play` ) );
$( "button.stop" )
	.click( () => $.get( `http://${localIp}:${localPort}/stop` ) );

$( `input:checkbox` )
	.on( "change", ( evt ) => {
		let el = evt.target;
		if ( el.checked ) {
			$( `input:checkbox` )
				.each( ( i, el ) => el.value === i ? el.checked = true : el.checked = false )

			$.get( `http://${localIp}:${localPort}/led/${ el.value }/on` );
		} else {
			$.get( `http://${localIp}:${localPort}/led/${ el.value }/off` );
		}
	} );
