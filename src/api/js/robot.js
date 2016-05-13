"use strict";
var Edison = require( "edison-io" );
var _ = require( "lodash" );
var five = require( "johnny-five" );


var board = new five.Board( {
	io: new Edison(),
	repl: false,
	//debug: false,
} );

var currentLEDIndex = 0;
var leds;
var interval = null;

var ticksPerSecond = 60;
var tickIntervalMillis = 1000 / ticksPerSecond;
var startTime = 0;
var patternFunction = sweep;

board.on( "ready", setup );

function setup() {
	currentLEDIndex = 0;
	leds = new five.Leds( [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] );
	play();
}

function play() {
	if ( interval ) return;
	startTime = Date.now();
	interval = setInterval( loop, tickIntervalMillis );
}

function stop() {
	clearInterval( interval );
	interval = null;
}

function loop() {
	var now = Date.now();
	var runTime = now - startTime;
	var tick = Math.floor( runTime / tickIntervalMillis );
	patternFunction( tick );
}

function sweep( tick ) {
	leds.each( function ( led ) {
		led.off();
	} );

	leds[ tick % leds.length ].on();
	currentLEDIndex = ( currentLEDIndex + 1 );
}

function led( model ) {
	model.id = model.id || 0;
	model.state = model.state || "off";
	// stop loop
	stop();
	// kill other leds
	leds.each( ( led ) => led.off() );
	// start the led at id
	currentLEDIndex = model.id;
	leds[ currentLEDIndex ][ model.state ]();
}

module.exports = {
	led,
	play,
	stop,
};
