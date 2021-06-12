Cards.PlayedView = function ( gameView ) {
	Cards.PlayedView.super.call( this );
	Cards.DroppableView.call( this );

	this.gameView = gameView;

	this.cardList = new Cards.CardList( 'played' );

	this.$element.addClass( 'game-played' ).append( this.cardList.$element );
};

OO.inheritClass( Cards.PlayedView, OO.ui.Widget );
OO.mixinClass( Cards.PlayedView, Cards.DroppableView );

Cards.PlayedView.prototype.update = function () {
	var view = this;

	this.cardList.clearItems().addItems(
		view.gameView.model.cards.played.slice( -3 ).map( function ( id ) {
			var cardView = new Cards.PlayableCardView( view.gameView, id, view.cardList );
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} )
	);

	this.cardList.toggleDraggable( false );
};

Cards.PlayedView.prototype.isDroppable = function () {
	var gameView = this.gameView;
	var cardView = gameView.hand.dragItem;

	// Hand -> Played
	return cardView && cardView.model.type === 'action';
};

Cards.PlayedView.prototype.drop = function () {
	var gameView = this.gameView;

	gameView.hand.dragItem.onPlay();
};
