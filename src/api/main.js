'use strict';

var apiServer = require( './server' );
var robot = require( './robot' );

apiServer.on( 'led', robot.led );
apiServer.on( 'play', robot.play );
apiServer.on( 'stop', robot.stop );
