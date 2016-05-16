'use strict';
var TASK = require( '../../shared/js/TASK/TASK' );

var AppModel = require( './modules/app/Model' );
var APP = new AppModel( {} );

// Distribute Global Vars
TASK.prototype.TEMPLATES = require( './lib/templates' );
TASK.prototype.APP = APP;
TASK.prototype.GLOBALS = window.GLOBALS;

// Get Views
var AppPage = require( './modules/app/View' );

// Start App
var appPage = new AppPage( {
	model: APP
} );

appPage.once( 'afterRender', APP.setupRouter );
appPage.render();
