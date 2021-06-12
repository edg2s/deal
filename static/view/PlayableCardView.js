Cards.PlayableCardView = function ( gameView, id, cardList, isCurrentUser ) {
	Cards.PlayableCardView.super.call( this );
	OO.ui.mixin.DraggableElement.call( this );

	this.gameView = gameView;
	this.cardView = new Cards.CardView( id );
	this.model = new Cards.CardModel( id );
	this.cardList = cardList;
	var location = this.cardList.location;

	this.$element.addClass( 'card-container' ).append( this.cardView.$element );

	if ( this.gameView.model.cards.rotated[ this.model.id ] ) {
		this.cardView.$element.addClass( 'card-rotated' );
	}

	var moveLeftButton = new OO.ui.ButtonWidget( { icon: 'previous', title: 'Move left' } );
	var moveRightButton = new OO.ui.ButtonWidget( { icon: 'next', title: 'Move right' } );
	var playButton = new OO.ui.ButtonWidget( { icon: 'upTriangle', title: 'Play' } );
	var moneyButton = new OO.ui.ButtonWidget( { icon: 'money', title: 'Play as money' } );
	var rotateButton = new OO.ui.ButtonWidget( { icon: 'reload', title: 'Rotate' } );
	var passButton = new OO.ui.ButtonWidget( { icon: 'userGroup', title: 'Pass to another player' } );
	var discardButton = new OO.ui.ButtonWidget( { icon: 'trash', title: 'Discard', flags: [ 'destructive' ] } );
	var undoButton = new OO.ui.ButtonWidget( { icon: 'downTriangle', title: 'Return to my hand' } );

	moveLeftButton.on( 'click', this.onMove.bind( this, -1 ) );
	moveRightButton.on( 'click', this.onMove.bind( this, 1 ) );
	playButton.on( 'click', this.onPlay.bind( this ) );
	moneyButton.on( 'click', this.emit.bind( this, 'action', 'money', this.model.id ) );
	rotateButton.on( 'click', this.onRotate.bind( this ) );
	discardButton.on( 'click', this.onDiscard.bind( this ) );
	passButton.on( 'click', this.onPass.bind( this ) );
	undoButton.on( 'click', this.emit.bind( this, 'action', 'undo', this.model.id, location ) );

	var items = [];
	if ( Cards.isMobile && ( location === 'hand' || isCurrentUser ) ) {
		items.push( moveLeftButton );
	}
	if ( location !== 'played' ) {
		if ( location === 'hand' ) {
			items.push( playButton );
			if (
				// Allow viewType=action too so houses/hotels can be played as money
				( this.model.type === 'action' || this.model.viewType === 'action' ) &&
				this.model.value
			) {
				items.push( moneyButton );
			}
		}
		if (
			this.model.viewType === 'wildcard' && this.model.name !== 'all' &&
			( isCurrentUser || location === 'hand' )
		) {
			items.push( rotateButton );
		}
		if ( location !== 'hand' && isCurrentUser ) {
			items.push( passButton );
		}
		if ( location === 'hand' ) {
			items.push( discardButton );
		}
	}
	if (
		location === 'played' ||
		( isCurrentUser && ( location === 'property' || location === 'money' ) )
	) {
		items.push( undoButton );
	}
	if ( Cards.isMobile && ( location === 'hand' || isCurrentUser ) ) {
		items.push( moveRightButton );
	}

	if ( items.length ) {
		var buttons = new OO.ui.ButtonGroupWidget( {
			items: items
		} );

		this.$element.append(
			$( '<div>' ).addClass( 'card-buttons' ).append(
				buttons.$element
			)
		);
	}
};

OO.inheritClass( Cards.PlayableCardView, OO.ui.Widget );
OO.mixinClass( Cards.PlayableCardView, OO.ui.mixin.DraggableElement );

Cards.PlayableCardView.prototype.onPlay = function () {
	this.emit( 'action', this.model.type, this.model.id );
};

Cards.PlayableCardView.prototype.playAsPropertyOrMoney = function () {
	switch ( this.model.type ) {
		case 'property':
			this.emit( 'action', 'property', this.model.id );
			break;
		case 'money':
		case 'action':
			this.emit( 'action', 'money', this.model.id );
			break;
	}
};

Cards.PlayableCardView.prototype.passTo = function ( userId ) {
	this.emit(
		'action',
		this.cardList.location === 'money' ? 'passMoney' : 'passProperty',
		this.model.id,
		userId
	);
};

Cards.PlayableCardView.prototype.onDiscard = function () {
	var view = this;

	OO.ui.confirm( 'This cannot be undone.', {
		title: 'Discard this card to the bottom of the deck?',
		actions: [
			{ action: 'cancel', label: 'Cancel', flags: [ 'primary' ] },
			{ action: 'accept', label: 'Discard', flags: [ 'destructive', 'primary' ] }
		]
	} ).then( function ( result ) {
		if ( result ) {
			view.emit( 'action', 'discard', view.model.id );
		}
	} );
};

Cards.PlayableCardView.prototype.onRotate = function () {
	this.emit( 'action', 'rotate', this.model.id );
	// eslint-disable-next-line no-jquery/no-class-state
	this.$card.toggleClass( 'card-rotated' );
};

Cards.PlayableCardView.prototype.onPass = function () {
	var view = this;
	var cardModel = this.model;
	var gameModel = this.gameView.model;
	var actions = [
		{ action: 'cancel', label: 'Cancel', flags: [ 'destructive' ] }
	];

	Object.keys( gameModel.users ).forEach( function ( userId ) {
		var hand = gameModel.getHand( userId );
		if (
			hand.property.indexOf( cardModel.id ) === -1 &&
			hand.money.indexOf( cardModel.id ) === -1
		) {
			actions.push( { action: userId, label: gameModel.users[ userId ] } );
		}
	} );

	OO.ui.getWindowManager().openWindow(
		'message',
		{
			title: 'Pass ' + this.model.title + ' to another player',
			actions: actions,
			size: 'medium'
		}
	).closing.then( function ( data ) {
		if ( data && data.action !== 'cancel' ) {
			view.passTo( data.action );
		}
	} );
};

Cards.PlayableCardView.prototype.onMove = function ( dir ) {
	var items = this.cardList.items;
	var index = items.indexOf( this );
	var newIndex = index + dir;

	if ( newIndex >= 0 && newIndex < items.length ) {
		this.cardList.emit( 'reorder', this, index + dir );
		this.cardList.addItems( [ this ], index + dir );
	}
};
