Cards.PlayedView = function ( gameView ) {
	Cards.PlayedView.super.call( this );
	Cards.DroppableView.call( this );

	this.gameView = gameView;

	this.$element.addClass( 'game-played' );
};

OO.inheritClass( Cards.PlayedView, OO.ui.Widget );
OO.mixinClass( Cards.PlayedView, Cards.DroppableView );

Cards.PlayedView.prototype.update = function () {
	var view = this;

	this.$element.empty();

	this.gameView.model.cards.played.slice( -3 ).forEach( function ( id ) {
		var cardView = new Cards.CardView( view.gameView, id, 'played' );
		cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
		view.$element.append( cardView.$element );
	} );
};

Cards.PlayedView.prototype.isDroppable = function () {
	var gameView = this.gameView,
		cardView = gameView.hand.dragItem;

	// Hand -> Played
	return cardView && (
		cardView.model.type === 'rent' ||
		( cardView.model.type === 'action' &&
			!( cardView.model.name === 'house' || cardView.model.name === 'hotel' )
		)
	);
};

Cards.PlayedView.prototype.drop = function () {
	var gameView = this.gameView;

	gameView.hand.dragItem.onPlay();
};
