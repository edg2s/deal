Cards.CardList = class CardList extends OO.ui.Widget {
	constructor( location, config ) {
		// Configuration initialization
		config = config || {};

		// Parent constructor
		super( config );

		this.location = location;

		// Mixin constructors
		OO.ui.mixin.DraggableGroupElement.call( this, $.extend( {
			$group: this.$element
		}, config ) );
	}
};

/* Setup */
OO.mixinClass( Cards.CardList, OO.ui.mixin.DraggableGroupElement );
