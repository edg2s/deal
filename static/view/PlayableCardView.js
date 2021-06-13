Cards.PlayableCardView = class PlayableCardView extends OO.ui.Widget {
	constructor( gameView, id, cardList, isCurrentUser ) {
		super();
		OO.ui.mixin.DraggableElement.call( this );

		this.gameView = gameView;
		this.cardView = new Cards.CardView( id );
		this.model = new Cards.CardModel( id );
		this.cardList = cardList;
		const location = this.cardList.location;

		this.$element.addClass( 'card-container' ).append( this.cardView.$element );

		if ( this.gameView.model.cards.rotated[ this.model.id ] ) {
			this.cardView.$element.addClass( 'card-rotated' );
		}

		const moveLeftButton = new OO.ui.ButtonWidget( { icon: 'previous', title: 'Move left' } );
		const moveRightButton = new OO.ui.ButtonWidget( { icon: 'next', title: 'Move right' } );
		const playButton = new OO.ui.ButtonWidget( { icon: 'upTriangle', title: 'Play' } );
		const moneyButton = new OO.ui.ButtonWidget( { icon: 'money', title: 'Play as money' } );
		const rotateButton = new OO.ui.ButtonWidget( { icon: 'reload', title: 'Rotate' } );
		const passButton = new OO.ui.ButtonWidget( { icon: 'userGroup', title: 'Pass to another player' } );
		const discardButton = new OO.ui.ButtonWidget( { icon: 'trash', title: 'Discard', flags: [ 'destructive' ] } );
		const undoButton = new OO.ui.ButtonWidget( { icon: 'downTriangle', title: 'Return to my hand' } );

		moveLeftButton.on( 'click', this.onMove.bind( this, -1 ) );
		moveRightButton.on( 'click', this.onMove.bind( this, 1 ) );
		playButton.on( 'click', this.onPlay.bind( this ) );
		moneyButton.on( 'click', this.emit.bind( this, 'action', 'money', this.model.id ) );
		rotateButton.on( 'click', this.onRotate.bind( this ) );
		discardButton.on( 'click', this.onDiscard.bind( this ) );
		passButton.on( 'click', this.onPass.bind( this ) );
		undoButton.on( 'click', this.emit.bind( this, 'action', 'undo', this.model.id, location ) );

		const items = [];
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
			const buttons = new OO.ui.ButtonGroupWidget( {
				items: items
			} );

			this.$element.append(
				$( '<div>' ).addClass( 'card-buttons' ).append(
					buttons.$element
				)
			);
		}
	}

	onPlay() {
		this.emit( 'action', this.model.type, this.model.id );
	}

	playAsPropertyOrMoney() {
		switch ( this.model.type ) {
			case 'property': {
				this.emit( 'action', 'property', this.model.id );
				break;
			}
			case 'money':
			case 'action': {
				this.emit( 'action', 'money', this.model.id );
				break;
			}
		}
	}

	passTo( userId ) {
		this.emit(
			'action',
			this.cardList.location === 'money' ? 'passMoney' : 'passProperty',
			this.model.id,
			userId
		);
	}

	onDiscard() {
		OO.ui.confirm( 'This cannot be undone.', {
			title: 'Discard this card to the bottom of the deck?',
			actions: [
				{ action: 'cancel', label: 'Cancel', flags: [ 'primary' ] },
				{ action: 'accept', label: 'Discard', flags: [ 'destructive', 'primary' ] }
			]
		} ).then( ( result ) => {
			if ( result ) {
				this.emit( 'action', 'discard', this.model.id );
			}
		} );
	}

	onRotate() {
		this.emit( 'action', 'rotate', this.model.id );
		// eslint-disable-next-line no-jquery/no-class-state
		this.$card.toggleClass( 'card-rotated' );
	}

	onPass() {
		const cardModel = this.model;
		const gameModel = this.gameView.model;
		const actions = [
			{ action: 'cancel', label: 'Cancel', flags: [ 'destructive' ] }
		];

		Object.keys( gameModel.users ).forEach( ( userId ) => {
			const hand = gameModel.getHand( userId );
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
		).closing.then( ( data ) => {
			if ( data && data.action !== 'cancel' ) {
				this.passTo( data.action );
			}
		} );
	}

	onMove( dir ) {
		const items = this.cardList.items;
		const index = items.indexOf( this );
		const newIndex = index + dir;

		if ( newIndex >= 0 && newIndex < items.length ) {
			this.cardList.emit( 'reorder', this, index + dir );
			this.cardList.addItems( [ this ], index + dir );
		}
	}
};

OO.mixinClass( Cards.PlayableCardView, OO.ui.mixin.DraggableElement );
