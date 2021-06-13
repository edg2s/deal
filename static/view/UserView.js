Cards.UserView = class UserView extends OO.ui.Widget {
	constructor( userId, gameView ) {
		super();
		Cards.DroppableView.call( this );

		this.userId = userId;
		this.gameView = gameView;
		this.isCurrentUser = this.userId === localStorage.getItem( 'cards-userId' );

		this.property = new Cards.CardList( 'property', {
			classes: [ 'game-property' ]
		} );
		this.money = new Cards.CardList( 'money', {
			classes: [ 'game-money' ]
		} );

		const gameModel = this.gameView.model;
		if ( !( userId in gameModel.users ) ) {
			// User not in game
			return;
		}

		if ( this.isCurrentUser ) {
			this.property.on( 'reorder', this.onReorder.bind( this, 'property' ) );
			this.money.on( 'reorder', this.onReorder.bind( this, 'money' ) );
		}

		this.$element.append(
			this.property.$element,
			this.money.$element
		).attr( 'data-user', gameModel.users[ userId ] + ' (' + gameModel.getHand( userId ).hidden + ' in hand)' );
		this.property.addItems(
			gameModel.getHand( userId ).property.map( ( id ) => {
				const cardView = new Cards.PlayableCardView(
					this.gameView, id, this.property, this.isCurrentUser
				);
				cardView.on( 'action', this.emit.bind( this, 'cardAction' ) );
				return cardView;
			} )
		);
		this.money.addItems(
			gameModel.getHand( userId ).money.map( ( id ) => {
				const cardView = new Cards.PlayableCardView(
					this.gameView, id, this.money, this.isCurrentUser
				);
				cardView.on( 'action', this.emit.bind( this, 'cardAction' ) );
				return cardView;
			} )
		);
		this.property.toggleDraggable( this.isCurrentUser );
		this.money.toggleDraggable( this.isCurrentUser );

		this.$element.addClass( 'game-user' );
	}

	onReorder( location, card, index ) {
		this.emit( 'cardAction', 'reorder', location, card.model.id, index );
	}

	isDroppable() {
		const gameView = this.gameView;
		const currentUserView = gameView.currentUserView;

		// Hand -> Current user
		return ( gameView.hand.dragItem && this.isCurrentUser ) ||
			// Current user -> other user
			(
				( currentUserView.property.dragItem || currentUserView.money.dragItem ) &&
				!this.isCurrentUser
			);
	}

	drop() {
		const gameView = this.gameView;
		const currentUserView = gameView.currentUserView;

		if ( currentUserView.property.dragItem && !this.isCurrentUser ) {
			currentUserView.property.dragItem.passTo( this.userId );
		} else if ( currentUserView.money.dragItem && !this.isCurrentUser ) {
			currentUserView.money.dragItem.passTo( this.userId );
		} else if ( gameView.hand.dragItem && this.isCurrentUser ) {
			gameView.hand.dragItem.playAsPropertyOrMoney();
		}
	}
};

OO.mixinClass( Cards.UserView, Cards.DroppableView );
