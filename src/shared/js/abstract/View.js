var _ = require( 'lodash' );
var $ = require( 'jquery' );
var Emitter = require( 'backbone-events-standalone' );

class View extends Emitter {
	constructor( options ) {
		super();
		_.extend( this, {
			el: null,
			model: null,
			template: '',
			id: '',
			tagname: '',
			classname: '',
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
			events: {
				/*
                    eventName: 'click',
                    selector: 'button.play',
                    handler: this.handleButtonClick
                */
			}
		}, options );
		// create base Element
		this.$el = this.el ? $( this.el )
			.first() : $( `<${this.tagname} class='${this.classname}' id='${this.id}' />` );
		this.$ = this.$el.find;
	}

	static getTemplate( name ) {
		// TEMPLATES is a global object on window
		return name ? TEMPLATES.JST[ name ] : () => '';
	}

	render() {
		this.trigger( 'beforeRender', this );
		this.undelegateEvents();
		// put rendered JST template into $el
		var html = View.getTemplate( this.template )
			.render( this.serialize() );
		this.$el.html( html );
		// render child views
		this.delegateEvents();
		this.trigger( 'afterRender', this );
	}

	delegateEvents() {
		_.each( this.events, ( e ) => {
			this.$( e.selector )
				.on( e.name, e.handler );
		} );
		return this;
	}

	undelegateEvents() {
		_.each( this.events, ( e ) => {
			this.$( e.selector )
				.off( e.name, e.handler );
		} );
		return this;
	}

	serialize() {
		var model = this.model ? this.model.attributes() : {};
		// GLOBALS is a global object on window
		return _.extend( {}, model, GLOBALS );
	}
}

module.exports = View;
