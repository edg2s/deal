Cards.GameView = function ( model ) {
	var view = this;

	Cards.GameView.super.call( this );

	this.startButton = new OO.ui.ButtonWidget( { label: 'Start', flags: [ 'primary', 'progressive' ] } );
	this.clearButton = new OO.ui.ButtonWidget( { label: 'Clear game', flags: [ 'destructive' ] } );
	this.draw2Button = new OO.ui.ButtonWidget( { label: 'Draw 2', flags: [ 'progressive' ] } );
	this.draw5Button = new OO.ui.ButtonWidget( { label: 'Draw 5' } );
	this.helpButton = new OO.ui.ButtonWidget( { icon: 'help', label: 'Help', framed: false, classes: [ 'game-help' ] } );
	this.roomLabel = new OO.ui.LabelWidget( { label: 'Room: ' + Cards.roomName, classes: [ 'game-help' ] } );
	this.audioToggle = new OO.ui.CheckboxInputWidget( { selected: true } );
	var audioToggleField = new OO.ui.FieldLayout( this.audioToggle, {
		classes: [ 'game-audiotoggle' ],
		align: 'inline',
		label: 'Sounds'
	} );

	this.userNameInput = new OO.ui.TextInputWidget()
		.on( 'change', function () {
			view.emit( 'userName' );
		} );

	this.startButton.on( 'click', view.emit.bind( view, 'command', 'start' ) );
	this.clearButton.on( 'click', this.onClearClick.bind( this ) );
	// Debounce 1000ms to avoid accidental double deal
	this.draw2Button.on( 'click', OO.ui.debounce( view.emit.bind( view, 'command', 'draw', 2 ), 1000, true ) );
	this.draw5Button.on( 'click', OO.ui.debounce( view.emit.bind( view, 'command', 'draw', 5 ), 1000, true ) );
	this.helpButton.on( 'click', function () {
		OO.ui.getWindowManager().openWindow( 'help' );
	} );

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
	this.hand = new Cards.CardList( 'hand', { classes: [ 'game-hand' ] } );
	this.hand.on( 'reorder', this.onReorder.bind( this, 'hidden' ) );
	// Current user's view
	this.currentUserView = null;

	this.$element.addClass( 'game' ).append(
		$( '<div>' ).addClass( 'game-columns' ).append(
			$( '<div>' ).addClass( 'game-left' ).append(
				$( '<div>' ).addClass( 'game-controls' ).append(
					this.startButton.$element, this.clearButton.$element,
					this.draw2Button.$element, this.draw5Button.$element,
					audioToggleField.$element,
					this.helpButton.$element,
					this.roomLabel.$element
				),
				this.$users
			),
			$( '<div>' ).addClass( 'game-right' ).append(
				$( '<div>' ).addClass( 'game-right-inner' ).append(
					$( '<div>' ).addClass( 'game-username' ).append(
						this.userNameInput.$element
					),
					this.played.$element,
					this.$log,
					new OO.ui.ButtonWidget( {
						framed: false,
						href: 'https://github.com/edg2s/deal',
						target: '_blank',
						label: 'Source code',
						flags: [ 'progressive' ],
						icon: 'code'
					} ).$element
				)
			)
		),
		this.hand.$element
	);

	this.updateButtons();
};

OO.inheritClass( Cards.GameView, OO.ui.Widget );

Cards.GameView.prototype.getUserName = function () {
	return this.userNameInput.getValue();
};

Cards.GameView.prototype.updateButtons = function () {
	this.startButton.setDisabled(
		this.model.state === 'started' ||
		Object.keys( this.model.users ).length <= 1
	);
	this.draw2Button.setDisabled(
		this.model.state !== 'started'
	);
	this.draw5Button.setDisabled(
		this.model.state !== 'started'
	);
};

Cards.GameView.prototype.log = function ( message, type ) {
	message = message.replace(
		/%card-([0-9]+)/,
		function () {
			return new Cards.CardModel( +arguments[ 1 ] ).title;
		}
	);
	this.$log.prepend(
		$( '<div>' )
			.addClass( 'game-message' )
			// The following classes are used here:
			// * game-message-discard
			// * game-message-game
			// * game-message-pass
			// * game-message-play
			// * game-message-undo
			.addClass( 'game-message-' + type )
			.text( message )
	);
};

Cards.GameView.prototype.clearLog = function () {
	this.$log.empty();
};

Cards.GameView.prototype.onCards = function () {
	this.played.update();
	this.onUsers();
};

Cards.GameView.prototype.onState = function () {
	this.updateButtons();
};

Cards.GameView.prototype.onHand = function () {
	var view = this;

	this.hand.$element.attr( 'data-hand', 'Your hand (' + this.model.hand.length + ')' );

	var items = this.model.hand.map( function ( id ) {
		var cardView = new Cards.PlayableCardView( view, id, view.hand );
		cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
		return cardView;
	} );
	this.hand.clearItems().addItems( items );
};

Cards.GameView.prototype.onUsers = function () {
	var view = this;

	this.updateButtons();

	this.$users.empty();

	var userIds = Object.keys( this.model.users );
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
