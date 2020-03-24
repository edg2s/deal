Cards.CardView = function ( gameView, id, location, isCurrentUser ) {
	var color, $rent, actionData, buttons, items,
		playButton, moneyButton, rotateButton, passButton, discardButton, undoButton,
		cardView = this;

	Cards.CardView.super.call( this );
	OO.ui.mixin.DraggableElement.call( this );

	this.gameView = gameView;
	this.model = new Cards.CardModel( id );
	// this.card = Cards.data.cards[ id ];
	this.location = location;

	this.$inner = $( '<div>' ).addClass( 'card-inner' );

	this.$card = $( '<div>' )
		.addClass( 'card card-' + this.model.type )
		.append( this.$inner );

	this.$element.addClass( 'card-container' ).append( this.$card );

	if ( this.gameView.model.cards.rotated[ this.model.id ] ) {
		this.$card.addClass( 'card-rotated' );
	}

	playButton = new OO.ui.ButtonWidget( { icon: 'upTriangle', title: 'Play' } );
	moneyButton = new OO.ui.ButtonWidget( { label: Cards.data.currency[ Cards.locale ], title: 'Play as money' } );
	rotateButton = new OO.ui.ButtonWidget( { icon: 'reload', title: 'Rotate' } );
	passButton = new OO.ui.ButtonWidget( { icon: 'userGroup', title: 'Pass to another player' } );
	discardButton = new OO.ui.ButtonWidget( { icon: 'trash', title: 'Discard', flags: [ 'destructive' ] } );
	undoButton = new OO.ui.ButtonWidget( { icon: 'undo', title: 'Return to my hand' } );

	playButton.on( 'click', this.onPlay.bind( this ) );
	moneyButton.on( 'click', this.emit.bind( this, 'action', 'money', this.model.id ) );
	rotateButton.on( 'click', this.onRotate.bind( this ) );
	discardButton.on( 'click', this.onDiscard.bind( this ) );
	passButton.on( 'click', this.onPass.bind( this ) );
	undoButton.on( 'click', this.emit.bind( this, 'action', 'undo', this.model.id, this.location ) );

	items = [];
	if ( location !== 'played' ) {
		if ( location === 'hand' ) {
			items.push( playButton );
			if ( this.model.type !== 'money' && this.model.value ) {
				items.push( moneyButton );
			}
		}
		if (
			this.model.type === 'wildcard' && this.model.name !== 'all' &&
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

	if ( items.length ) {
		buttons = new OO.ui.ButtonGroupWidget( {
			items: items
		} );

		this.$element.append(
			$( '<div>' ).addClass( 'card-buttons' ).append(
				buttons.$element
			)
		);
	}

	switch ( this.model.type ) {
		case 'money':
			this.$card.addClass( 'card-money-' + this.model.value );
			this.$inner.append(
				$( '<div>' ).addClass( 'card-title' ).append(
					$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
				)
			);
			break;
		case 'property':
			color = this.model.name.replace( /[0-9]+/, '' );
			this.$card.addClass( 'card-property-' + color );

			$rent = $( '<ol>' );
			Cards.data.rent[ color ].forEach( function ( rent ) {
				$rent.append(
					$( '<li>' ).text( Cards.currency( rent ) )
				);
			} );

			this.$inner.append(
				$( '<div>' ).addClass( 'card-title' ).text( this.model.title ),
				$rent
			);
			break;
		case 'action':
			actionData = Cards.data.actions[ this.model.name ];

			this.$card.addClass( 'card-action-' + this.model.name );
			this.$inner.append(
				$( '<div>' ).addClass( 'card-title' ).append(
					$( '<div>' ).addClass( 'card-icon' ).text( actionData.icon ),
					$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
				),
				$( '<div>' ).addClass( 'card-description' ).text( actionData.description )
			);
			break;
		case 'wildcard':
			if ( this.model.name !== 'all' ) {
				this.model.name.split( '-' ).forEach( function ( color, i ) {
					$rent = $( '<ol>' );
					Cards.data.rent[ color ].forEach( function ( rent ) {
						$rent.append(
							$( '<li>' ).text( Cards.currency( rent ) )
						);
					} );
					cardView.$inner.append(
						$( '<div>' ).addClass( 'card-wildcard-' + i + ' card-property card-property-' + color ).append(
							$( '<div>' ).addClass( 'card-title' ).text( cardView.model.title ),
							$rent
						)
					);
				} );
			} else {
				this.$card.addClass( 'card-wildcard-all' );
				this.$inner.append(
					$( '<div>' ).addClass( 'card-title' ).append(
						$( '<div>' ).addClass( 'text' ).text( this.model.title )
					),
					$( '<div>' ).addClass( 'card-description' ).text(
						'This card can be used as part of any property set. This card has no monetary value.'
					)
				);
			}
			break;
		case 'rent':
			this.$inner.append(
				$( '<div>' ).addClass( 'card-title card-rent-' + this.model.name ).append(
					$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
				),
				$( '<div>' ).addClass( 'card-description' ).text(
					this.model.name === 'all' ?
						'Force one player to pay you rent for properties you own in one of these colors.' :
						'All players pay you rent for properties you own in one of these colors.'
				)
			);
			break;
	}

	if ( this.model.value ) {
		this.$inner.append(
			$( '<div>' ).addClass( 'card-value' ).text( Cards.currency( this.model.value ) ),
			$( '<div>' ).addClass( 'card-value' ).text( Cards.currency( this.model.value ) )
		);
	}
};

OO.inheritClass( Cards.CardView, OO.ui.Widget );
OO.mixinClass( Cards.CardView, OO.ui.mixin.DraggableElement );

Cards.CardView.prototype.onPlay = function () {
	switch ( this.model.type ) {
		case 'property':
		case 'wildcard':
			this.emit( 'action', 'property', this.model.id );
			break;
		case 'money':
			this.emit( 'action', 'money', this.model.id );
			break;
		case 'action':
			if ( this.model.name === 'house' || this.model.name === 'hotel' ) {
				this.emit( 'action', 'property', this.model.id );
			} else {
				this.emit( 'action', 'action', this.model.id );
			}
			break;
		case 'rent':
			this.emit( 'action', 'action', this.model.id );
			break;
	}
};

Cards.CardView.prototype.onDiscard = function () {
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

Cards.CardView.prototype.onRotate = function () {
	this.emit( 'action', 'rotate', this.model.id );
	// eslint-disable-next-line no-jquery/no-class-state
	this.$card.toggleClass( 'card-rotated' );
};

Cards.CardView.prototype.onPass = function () {
	var view = this,
		cardModel = this.model,
		gameModel = this.gameView.model,
		actions = [
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
			view.emit(
				'action',
				view.location === 'money' ? 'passMoney' : 'passProperty',
				view.model.id,
				data.action
			);
		}
	} );
};
