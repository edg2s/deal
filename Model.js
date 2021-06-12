'use strict';

const
	shuffle = require( 'shuffle-array' ),
	OO = require( 'oojs' );

class Model {
	constructor( roomName ) {
		// Mixin
		OO.EventEmitter.call( this );

		this.roomName = roomName;

		this.clear();
	}

	clear() {
		this.users = {};
		this.cards = {
			deck: shuffle( Array.from( Array( 106 ).keys() ) ),
			played: [],
			hands: {},
			rotated: {}
		};
		this.state = 'init';
		this.emit( 'cards' );
		this.emit( 'users' );
		this.emit( 'state' );
	}

	addUser( userId ) {
		if ( !( userId in this.users ) && this.state === 'init' ) {
			this.users[ userId ] = '';
			this.emit( 'users' );
		}
	}

	setUserName( userId, userName ) {
		if ( userId in this.users ) {
			this.users[ userId ] = userName;
			this.emit( 'users' );
			if ( userName ) {
				console.log( this.roomName + ': User ' + userId + ' set name to ' + userName );
			}
		}
	}

	getHand( userId ) {
		this.cards.hands[ userId ] = this.cards.hands[ userId ] || {
			hidden: [],
			property: [],
			money: []
		};
		return this.cards.hands[ userId ];
	}

	getVisibleCards() {
		const cards = OO.copy( this.cards );
		for ( const u in cards.hands ) {
			cards.hands[ u ].hidden = cards.hands[ u ].hidden.length;
		}
		cards.deck = cards.deck.length;
		return cards;
	}

	start() {
		if ( this.state === 'init' ) {
			this.dealAll( 7 );
			this.state = 'started';
			this.emit( 'state' );
			this.log( '🎲 Random user order: ' + shuffle( Object.values( this.users ) ).join( ', ' ), 'game' );
		}
	}

	dealAll( n ) {
		Object.keys( this.users ).forEach( ( userId ) => {
			this.deal( userId, n, true );
		} );
		this.emit( 'cards' );
	}

	deal( userId, n, noEmit ) {
		const hand = this.getHand( userId );
		const dealt = this.cards.deck.splice( 0, n );
		hand.hidden = hand.hidden.concat( dealt );
		this.log( '🎁 Dealt ' + dealt.length + ' cards to ' + this.users[ userId ], 'game' );

		if ( !this.cards.deck.length ) {
			this.log( '⚠️ Draw pile ran out', 'game' );
			if ( this.cards.played.length ) {
				this.cards.deck = shuffle( this.cards.played );
				this.cards.played = [];
				this.log( '🔀 Shuffled the played cards', 'game' );

				// Deal remaining cards
				if ( dealt.length < n ) {
					this.deal( userId, n - dealt.length, true );
				}
			}
		}

		if ( !noEmit ) {
			this.emit( 'cards' );
		}
	}

	log( message, type ) {
		this.emit( 'log', message, type );
	}

	reorder( userId, location, cardId, index ) {
		if ( ![ 'hidden', 'property', 'money' ].includes( location ) ) {
			console.log( this.roomName + ': reorder: location ' + location + ' not found' );
			return;
		}

		const hand = this.getHand( userId )[ location ];
		const cardIndex = hand.indexOf( cardId );
		if ( cardIndex !== -1 ) {
			hand.splice( cardIndex, 1 );
			if ( index > cardIndex ) {
				// Adjust for removal
				index--;
			}
			hand.splice( index, 0, cardId );
			if ( location !== 'hidden' ) {
				this.emit( 'cards' );
			}
		} else {
			console.log( this.roomName + ': reorder: card not found in hand' );
		}
	}

	move( cardId, from, to, userId, message, icon, type ) {
		const cardIndex = from.indexOf( cardId );
		this.log(
			( icon ? icon + ' ' : '' ) +
			this.users[ userId ] + ' ' +
			message.replace( '%card', ' %card-' + cardId ),
			type
		);
		if ( cardIndex !== -1 ) {
			from.splice( cardIndex, 1 );
			to.push( cardId );
			this.emit( 'cards' );
		} else {
			console.log( 'move: card not found in hand' );
		}
	}

	property( userId, cardId ) {
		this.move(
			cardId,
			this.getHand( userId ).hidden,
			this.getHand( userId ).property,
			userId,
			'played %card',
			'🏙️',
			'play'
		);
	}

	money( userId, cardId ) {
		this.move(
			cardId,
			this.getHand( userId ).hidden,
			this.getHand( userId ).money,
			userId,
			'played money %card',
			'💰',
			'play'
		);
	}

	action( userId, cardId ) {
		this.move(
			cardId,
			this.getHand( userId ).hidden,
			this.cards.played,
			userId,
			'played %card',
			'▶️',
			'play'
		);
	}

	discard( userId, cardId ) {
		this.move(
			cardId,
			this.getHand( userId ).hidden,
			this.cards.deck,
			userId,
			'discarded a card',
			'🗑️',
			'discard'
		);
	}

	rotate( userId, cardId ) {
		if ( cardId in this.cards.rotated ) {
			delete this.cards.rotated[ cardId ];
		} else {
			this.cards.rotated[ cardId ] = true;
		}
		this.emit( 'cards' );
	}

	passProperty( userId, cardId, targetUserid ) {
		const targetUserName = this.users[ targetUserid ];
		this.move(
			cardId,
			this.getHand( userId ).property,
			this.getHand( targetUserid ).property,
			userId,
			'passed %card to ' + targetUserName,
			'🏙️',
			'pass'
		);
	}

	passMoney( userId, cardId, targetUserid ) {
		const targetUserName = this.users[ targetUserid ];
		this.move(
			cardId,
			this.getHand( userId ).money,
			this.getHand( targetUserid ).money,
			userId,
			'passed %card to ' + targetUserName,
			'💰',
			'pass'
		);
	}

	undo( userId, cardId, sourceLocation ) {
		let sourceDeck;
		switch ( sourceLocation ) {
			case 'played': {
				sourceDeck = this.cards.played;
				break;
			}
			case 'property':
			case 'money': {
				sourceDeck = this.getHand( userId )[ sourceLocation ];
				break;
			}
		}
		this.move(
			cardId,
			sourceDeck,
			this.getHand( userId ).hidden,
			userId,
			'took back %card',
			'↩️',
			'undo'
		);
	}
}

OO.mixinClass( Model, OO.EventEmitter );

module.exports = Model;
