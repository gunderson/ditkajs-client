var _ = require( 'lodash' );
var $ = require( 'jquery' );
var TASK = require( './TASK' );

class View extends TASK {
	constructor( options ) {
		super();

		View.parseName( options );

		_.extend( this, {
			el: null,
			model: null,
			template: '',
			id: '',
			tagname: '',
			classname: '',
			hasRendered: false,
			loadPromise: null,
			views: [
				/*
                    new ChildView0({
                        el: '#child-id-0',
                        model: this.model.widgets.at(0)
                    }),
                    new ChildView1({
                        el: '#child-id-1',
                        model: this.model.widgets.at(1)
                    }), ...
                */
			],
			events: [
				/*
				{
                    eventName: 'click',
                    selector: 'button.play',
                    handler: this.handleButtonClick
				}
				*/
			]
		}, options );

		// create base Element
		this.$el = this.el ? $( this.el )
			.first() : $( `<${this.tagname} class='${this.classname}' id='${this.id}' />` );
		this.$ = this.$el.find.bind( this.$el );
	}

	static getTemplate( name ) {
		// TEMPLATES is a global object on window
		return name ? TEMPLATES[ name ] : () => '';
	}

	static parseName( options ) {
		var name = options.name;
		if ( name ) {
			options.el = '#' + name;
		}
		return options;
	}

	render() {
		this.trigger( 'beforeRender', this );
		this.undelegateEvents();

		// put rendered JST template into $el
		if ( this.template ) {
			var html = View.getTemplate( this.template )( this.serialize() );
			this.$el.html( html );
		}
		// render child views
		_.each( this.views, ( v ) => v.render() );

		this.delegateEvents();
		this.trigger( 'afterRender', this );
		this.hasRendered = true;
	}

	delegateEvents() {
		_.each( this.events, ( e ) => {
			this.$( e.selector )
				.on( e.eventName, this[ e.handler ] );
		} );
		return this;
	}

	undelegateEvents() {
		_.each( this.events, ( e ) => {
			this.$( e.selector )
				.off( e.eventName );
		} );
		return this;
	}

	serialize() {
		var model = this.model ? this.model.attributes : {};
		// GLOBALS is a global object on window
		return _.extend( {}, model, GLOBALS );
	}
}

module.exports = View;
