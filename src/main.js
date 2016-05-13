"use strict";

var apiServer = require( "./api/js/server" );
var appServer = require( "./front-end/js/server" );
var robot = require( "./api/js/robot" );

apiServer.on( "led", robot.led );
apiServer.on( "play", robot.play );
apiServer.on( "stop", robot.stop );
