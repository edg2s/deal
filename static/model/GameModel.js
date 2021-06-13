Cards.GameModel = class {
	constructor() {
		OO.EventEmitter.call( this );

		this.cards = {};
		this.users = {};
		this.hand = [];
		this.state = 'init';
	}

	setCards( cards ) {
		this.cards = cards;
		this.emit( 'cards' );
	}

	setUsers( users ) {
		this.users = users;
		this.emit( 'users' );
	}

	setHand( hand ) {
		this.hand = hand;
		this.emit( 'hand' );
	}

	setState( state ) {
		this.state = state;
		this.emit( 'state' );
	}

	getHand( userId ) {
		return this.cards.hands[ userId ] || {
			property: [],
			money: [],
			hidden: 0
		};
	}
};

OO.mixinClass( Cards.GameModel, OO.EventEmitter );
