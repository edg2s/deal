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
	this.cardList.clearItems().addItems(
		this.gameView.model.cards.played.slice( -3 ).map( ( id ) => {
			const cardView = new Cards.PlayableCardView( this.gameView, id, this.cardList );
			cardView.on( 'action', this.emit.bind( this, 'cardAction' ) );
			return cardView;
		} )
	);

	this.cardList.toggleDraggable( false );
};

Cards.PlayedView.prototype.isDroppable = function () {
	const gameView = this.gameView;
	const cardView = gameView.hand.dragItem;

	// Hand -> Played
	return cardView && cardView.model.type === 'action';
};

Cards.PlayedView.prototype.drop = function () {
	const gameView = this.gameView;

	gameView.hand.dragItem.onPlay();
};
