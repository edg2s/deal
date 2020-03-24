const
	shuffle = require( 'shuffle-array' ),
	OO = require( 'oojs' );

function Model() {
	// Mixin
	OO.EventEmitter.call( this );

	this.clear();
}

OO.mixinClass( Model, OO.EventEmitter );

Model.prototype.clear = function () {
	this.users = {};
	this.cards = {
		deck: shuffle( Array.from( Array( 106 ).keys() ) ),
		played: [],
		hands: {}
	};
	this.state = 'init';
	this.log( 'Game cleared' );
	this.emit( 'cards' );
	this.emit( 'users' );
	this.emit( 'state' );
};

Model.prototype.addUser = function ( userId, userName ) {
	if ( !( userId in this.users ) ) {
		this.users[ userId ] = userName;
		this.emit( 'users' );
	}
};

Model.prototype.getHand = function ( userId ) {
	this.cards.hands[ userId ] = this.cards.hands[ userId ] || {
		hidden: [],
		property: [],
		money: []
	};
	return this.cards.hands[ userId ];
};

Model.prototype.getVisibleCards = function () {
	const cards = OO.copy( this.cards );
	for ( const u in cards.hands ) {
		cards.hands[ u ].hidden = cards.hands[ u ].hidden.length;
	}
	cards.deck = cards.deck.length;
	return cards;
};

Model.prototype.start = function () {
	if ( this.state === 'init' ) {
		this.dealAll( 7 );
		this.state = 'started';
		this.emit( 'state' );
	}
};

Model.prototype.dealAll = function ( n ) {
	const model = this;
	Object.keys( this.users ).forEach( ( userId ) => {
		model.deal( userId, n, true );
	} );
	this.log( 'Dealt ' + n + ' cards to all players' );
	this.emit( 'cards' );
};

Model.prototype.deal = function ( userId, n, noEmit ) {
	const hand = this.getHand( userId );
	hand.hidden = hand.hidden.concat( this.cards.deck.splice( 0, n ) );
	this.log( 'Dealt ' + n + ' cards to ' + this.users[ userId ] );
	if ( !noEmit ) {
		this.emit( 'cards' );
	}
};

Model.prototype.log = function ( message ) {
	this.emit( 'log', message );
};

Model.prototype.move = function ( cardId, from, to, userId, message ) {
	const cardIndex = from.indexOf( cardId );
	this.log( this.users[ userId ] + ' ' + message.replace( '%card', ' %card-' + cardId ) );
	if ( cardIndex !== -1 ) {
		from.splice( cardIndex, 1 );
		to.push( cardId );
		this.emit( 'cards' );
	} else {
		this.log( 'Error: Couldn\'t move card' );
	}
};

Model.prototype.property = function ( userId, cardId ) {
	this.move(
		cardId,
		this.getHand( userId ).hidden,
		this.getHand( userId ).property,
		userId,
		'played %card'
	);
};

Model.prototype.money = function ( userId, cardId ) {
	this.move(
		cardId,
		this.getHand( userId ).hidden,
		this.getHand( userId ).money,
		userId,
		'played money %card'
	);
};

Model.prototype.action = function ( userId, cardId ) {
	this.move(
		cardId,
		this.getHand( userId ).hidden,
		this.cards.played,
		userId,
		'played %card'
	);
};

Model.prototype.discard = function ( userId, cardId ) {
	this.move(
		cardId,
		this.getHand( userId ).hidden,
		this.cards.deck,
		userId,
		'discarded a card'
	);
};

Model.prototype.passProperty = function ( userId, cardId, targetUserid ) {
	const targetUserName = this.users[ targetUserid ];
	this.move(
		cardId,
		this.getHand( userId ).property,
		this.getHand( targetUserid ).property,
		userId,
		'passed %card to ' + targetUserName
	);
};

Model.prototype.passMoney = function ( userId, cardId, targetUserid ) {
	const targetUserName = this.users[ targetUserid ];
	this.move(
		cardId,
		this.getHand( userId ).money,
		this.getHand( targetUserid ).money,
		userId,
		'passed %card to ' + targetUserName
	);
};

Model.prototype.undo = function ( userId, cardId, sourceLocation ) {
	let sourceDeck;
	switch ( sourceLocation ) {
		case 'played':
			sourceDeck = this.cards.played;
			break;
		case 'property':
		case 'money':
			sourceDeck = this.getHand( userId )[ sourceLocation ];
			break;
	}
	this.move( cardId, sourceDeck, this.getHand( userId ).hidden, userId, 'took back %card' );
};

module.exports = Model;