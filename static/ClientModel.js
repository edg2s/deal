Cards.ClientModel = function () {
	OO.EventEmitter.call( this );

	this.cards = {};
	this.users = {};
	this.hand = [];
	this.state = 'init';
};

OO.mixinClass( Cards.ClientModel, OO.EventEmitter );

Cards.ClientModel.prototype.setCards = function ( cards ) {
	this.cards = cards;
	this.emit( 'cards' );
};

Cards.ClientModel.prototype.setUsers = function ( users ) {
	this.users = users;
	this.emit( 'users' );
};

Cards.ClientModel.prototype.setHand = function ( hand ) {
	this.hand = hand;
	this.emit( 'hand' );
};

Cards.ClientModel.prototype.setState = function ( state ) {
	this.state = state;
	this.emit( 'state' );
};

Cards.ClientModel.prototype.getHand = function ( userId ) {
	return this.cards.hands[ userId ] || {
		property: [],
		money: [],
		hidden: 0
	};
};
