Cards.PlayedView = class PlayedView extends OO.ui.Widget {
	constructor( gameView ) {
		super();
		Cards.DroppableView.call( this );

		this.gameView = gameView;

		this.cardList = new Cards.CardList( 'played' );

		this.$element.addClass( 'game-played' ).append( this.cardList.$element );
	}

	update() {
		this.cardList.clearItems().addItems(
			this.gameView.model.cards.played.slice( -3 ).map( ( id ) => {
				const cardView = new Cards.PlayableCardView( this.gameView, id, this.cardList );
				cardView.on( 'action', this.emit.bind( this, 'cardAction' ) );
				return cardView;
			} )
		);

		this.cardList.toggleDraggable( false );
	}

	isDroppable() {
		const gameView = this.gameView;
		const cardView = gameView.hand.dragItem;

		// Hand -> Played
		return cardView && cardView.model.type === 'action';
	}

	drop() {
		const gameView = this.gameView;

		gameView.hand.dragItem.onPlay();
	}
};

OO.mixinClass( Cards.PlayedView, Cards.DroppableView );
