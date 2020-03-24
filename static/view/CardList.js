Cards.CardList = function ( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	Cards.CardList.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.DraggableGroupElement.call( this, $.extend( {
		$group: this.$element
	}, config ) );
};

/* Setup */
OO.inheritClass( Cards.CardList, OO.ui.Widget );
OO.mixinClass( Cards.CardList, OO.ui.mixin.DraggableGroupElement );
