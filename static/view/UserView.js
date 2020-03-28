Cards.UserView = function ( userId, gameView ) {
	var gameModel,
		view = this;

	Cards.UserView.super.call( this );
	Cards.DroppableView.call( this );

	this.userId = userId;
	this.gameView = gameView;
	this.isCurrentUser = this.userId === localStorage.getItem( 'cards-userId' );

	gameModel = this.gameView.model;

	this.property = new Cards.CardList( 'property', {
		classes: [ 'game-property' ]
	} );
	this.money = new Cards.CardList( 'money', {
		classes: [ 'game-money' ]
	} );

	if ( !gameModel.users[ userId ] ) {
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
		gameModel.getHand( userId ).property.map( function ( id ) {
			var cardView = new Cards.PlayableCardView(
				view.gameView, id, view.property, view.isCurrentUser
			);
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} )
	);
	this.money.addItems(
		gameModel.getHand( userId ).money.map( function ( id ) {
			var cardView = new Cards.PlayableCardView(
				view.gameView, id, view.money, view.isCurrentUser
			);
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} )
	);
	this.property.toggleDraggable( this.isCurrentUser );
	this.money.toggleDraggable( this.isCurrentUser );

	this.$element.addClass( 'game-user' );
};

OO.inheritClass( Cards.UserView, OO.ui.Widget );
OO.mixinClass( Cards.UserView, Cards.DroppableView );

Cards.UserView.prototype.onReorder = function ( location, card, index ) {
	this.emit( 'cardAction', 'reorder', location, card.model.id, index );
};

Cards.UserView.prototype.isDroppable = function () {
	var gameView = this.gameView,
		currentUserView = gameView.currentUserView;

	// Hand -> Current user
	return ( gameView.hand.dragItem && this.isCurrentUser ) ||
		// Current user -> other user
		(
			( currentUserView.property.dragItem || currentUserView.money.dragItem ) &&
			!this.isCurrentUser
		);
};

Cards.UserView.prototype.drop = function () {
	var gameView = this.gameView,
		currentUserView = gameView.currentUserView;

	if ( currentUserView.property.dragItem && !this.isCurrentUser ) {
		currentUserView.property.dragItem.passTo( this.userId );
	} else if ( currentUserView.money.dragItem && !this.isCurrentUser ) {
		currentUserView.money.dragItem.passTo( this.userId );
	} else if ( gameView.hand.dragItem && this.isCurrentUser ) {
		gameView.hand.dragItem.playAsPropertyOrMoney();
	}
};
