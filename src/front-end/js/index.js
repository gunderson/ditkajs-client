'use strict';
var _ = require( 'lodash' );
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

var routes = _.map( appPage.pageViews, ( v ) => v.name.slice( 0, -5 ) );

appPage.once( 'afterRender', () => APP.setupRouter( routes ) );
appPage.render();
