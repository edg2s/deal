Cards.UserView = function ( userId, gameView ) {
	var gameModel,
		view = this;

	Cards.UserView.super.call( this );

	this.userId = userId;
	this.gameView = gameView;
	this.isCurrentUser = this.userId === localStorage.getItem( 'cards-userId' );

	gameModel = this.gameView.model;

	this.property = new Cards.CardList( {
		classes: [ 'game-property' ],
		draggable: this.isCurrentUser
	} );
	this.money = new Cards.CardList( {
		classes: [ 'game-money' ],
		draggable: this.isCurrentUser
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
			var cardView = new Cards.CardView( view.gameView, id, 'property', view.isCurrentUser );
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} )
	);
	this.money.addItems(
		gameModel.getHand( userId ).money.map( function ( id ) {
			var cardView = new Cards.CardView( view.gameView, id, 'money', view.isCurrentUser );
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} )
	);

	this.$element.addClass( 'game-user' );
};

OO.inheritClass( Cards.UserView, OO.ui.Widget );

Cards.UserView.prototype.onReorder = function ( location, card, index ) {
	this.emit( 'cardAction', 'reorder', location, card.model.id, index );
};
