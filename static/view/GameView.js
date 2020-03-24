Cards.GameView = function ( model ) {
	var view = this;

	Cards.GameView.super.call( this );

	this.startButton = new OO.ui.ButtonWidget( { label: 'Start', flags: [ 'primary', 'progressive' ] } );
	this.clearButton = new OO.ui.ButtonWidget( { label: 'Clear game', flags: [ 'destructive' ] } );
	this.drawButton = new OO.ui.ButtonWidget( { label: 'Draw 2 cards', flags: [ 'progressive' ] } );

	this.userName = new OO.ui.TextInputWidget( {
		value: localStorage.getItem( 'cards-userName' ),
		readOnly: true
	} );

	this.startButton.on( 'click', view.emit.bind( view, 'command', 'start' ) );
	this.clearButton.on( 'click', this.onClearClick.bind( this ) );
	this.drawButton.on( 'click', view.emit.bind( view, 'command', 'draw' ) );

	this.model = model;

	this.model.connect( this, {
		hand: 'onHand',
		users: 'onUsers',
		cards: 'onCards',
		state: 'onState'
	} );

	this.$log = $( '<div>' ).addClass( 'game-log' );
	this.$played = $( '<div>' ).addClass( 'game-played' );
	this.$users = $( '<div>' ).addClass( 'game-users' );
	this.hand = new Cards.CardList( { classes: [ 'game-hand' ] } );
	this.hand.on( 'reorder', this.onReorder.bind( this, 'hidden' ) );

	this.$element.addClass( 'game' ).append(
		$( '<div>' ).addClass( 'game-columns' ).append(
			$( '<div>' ).addClass( 'game-left' ).append(
				$( '<div>' ).addClass( 'game-controls' ).append(
					this.startButton.$element, this.clearButton.$element, this.drawButton.$element
				),
				this.$users
			),
			$( '<div>' ).addClass( 'game-right' ).append(
				$( '<div>' ).addClass( 'game-right-inner' ).append(
					$( '<div>' ).addClass( 'game-username' ).append(
						this.userName.$element
					),
					this.$played,
					this.$log
				)
			)
		),
		this.hand.$element
	);

	this.updateButtons();
};

OO.inheritClass( Cards.GameView, OO.ui.Widget );

Cards.GameView.prototype.updateButtons = function () {
	this.startButton.setDisabled(
		this.model.state === 'started' ||
		Object.keys( this.model.users ).length <= 1
	);
	this.drawButton.setDisabled(
		this.model.state !== 'started'
	);
};

Cards.GameView.prototype.log = function ( message ) {
	message = message.replace(
		/%card-([0-9]+)/,
		function () {
			return new Cards.CardModel( +arguments[ 1 ] ).title;
		}
	);
	this.$log.prepend(
		$( '<div>' ).addClass( 'game-message' ).text( message )
	);
};

Cards.GameView.prototype.onCards = function () {
	var view = this;

	this.$played.empty();

	this.model.cards.played.slice( -3 ).forEach( function ( id ) {
		var cardView = new Cards.CardView( view, id, 'played' );
		cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
		view.$played.append( cardView.$element );
	} );

	this.onUsers();
};

Cards.GameView.prototype.onState = function () {
	this.updateButtons();
};

Cards.GameView.prototype.onHand = function () {
	var items,
		view = this;

	this.hand.$element.attr( 'data-hand', 'Your hand (' + this.model.hand.length + ')' );

	items = this.model.hand.map( function ( id ) {
		var cardView = new Cards.CardView( view, id, 'hand' );
		cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
		return cardView;
	} );
	this.hand.clearItems().addItems( items );
};

Cards.GameView.prototype.onUsers = function () {
	var view = this,
		currentUserId = localStorage.getItem( 'cards-userId' ),
		userIds = Object.keys( this.model.users ).filter( function ( userId ) {
			return userId !== currentUserId;
		} ).concat( [ currentUserId ] );

	this.updateButtons();

	this.$users.empty();

	userIds.forEach( function ( userId ) {
		var items,
			$user = $( '<div>' ).addClass( 'game-user' ),
			isCurrentUser = userId === localStorage.getItem( 'cards-userId' ),
			property = new Cards.CardList( {
				classes: [ 'game-property' ],
				draggable: isCurrentUser
			} ),
			money = new Cards.CardList( {
				classes: [ 'game-money' ],
				draggable: isCurrentUser
			} );

		if ( !view.model.users[ userId ] ) {
			// User not in game
			return;
		}

		if ( isCurrentUser ) {
			property.on( 'reorder', view.onReorder.bind( view, 'property' ) );
			money.on( 'reorder', view.onReorder.bind( view, 'money' ) );
		}

		$user.append(
			property.$element,
			money.$element
		).attr( 'data-user', view.model.users[ userId ] + ' (' + view.model.getHand( userId ).hidden + ' in hand)' );
		items = view.model.getHand( userId ).property.map( function ( id ) {
			var cardView = new Cards.CardView( view, id, 'property', isCurrentUser );
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} );
		property.addItems( items );
		items = view.model.getHand( userId ).money.map( function ( id ) {
			var cardView = new Cards.CardView( view, id, 'money', isCurrentUser );
			cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
			return cardView;
		} );
		money.addItems( items );
		view.$users.append( $user );
	} );
};

Cards.GameView.prototype.onReorder = function ( location, card, index ) {
	this.emit( 'cardAction', 'reorder', location, card.model.id, index );
};

Cards.GameView.prototype.onClearClick = function () {
	var view = this;
	OO.ui.confirm( 'This cannot be undone.', {
		title: 'Clear the whole game and start again?',
		actions: [
			{ action: 'cancel', label: 'Continue playing', flags: [ 'primary' ] },
			{ action: 'accept', label: 'Clear game', flags: [ 'destructive', 'primary' ] }
		]
	} ).then( function ( result ) {
		if ( result ) {
			view.emit( 'command', 'clear' );
		}
	} );
};
