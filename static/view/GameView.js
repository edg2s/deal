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
	this.$users = $( '<div>' ).addClass( 'game-users' );
	this.played = new Cards.PlayedView( this );
	this.played.on( 'cardAction', this.emit.bind( this, 'cardAction' ) );
	this.hand = new Cards.CardList( { classes: [ 'game-hand' ] } );
	this.hand.on( 'reorder', this.onReorder.bind( this, 'hidden' ) );
	// Current user's view
	this.currentUserView = null;

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
					this.played.$element,
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
	this.played.update();
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
		userIds = Object.keys( this.model.users );

	this.updateButtons();

	this.$users.empty();

	userIds.forEach( function ( userId ) {
		var userView = new Cards.UserView( userId, view );
		// Pass through cardAction events
		userView.on( 'cardAction', view.emit.bind( view, 'cardAction' ) );
		if ( userView.isCurrentUser ) {
			view.currentUserView = userView;
		}
		view.$users.append( userView.$element );
	} );
	if ( this.currentUserView ) {
		// Put current user at the end
		this.$users.append( this.currentUserView.$element );
	}
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
