Cards.GameModel = function () {
	OO.EventEmitter.call( this );

	this.cards = {};
	this.users = {};
	this.hand = [];
	this.state = 'init';
};

OO.mixinClass( Cards.GameModel, OO.EventEmitter );

Cards.GameModel.prototype.setCards = function ( cards ) {
	this.cards = cards;
	this.emit( 'cards' );
};

Cards.GameModel.prototype.setUsers = function ( users ) {
	this.users = users;
	this.emit( 'users' );
};

Cards.GameModel.prototype.setHand = function ( hand ) {
	this.hand = hand;
	this.emit( 'hand' );
};

Cards.GameModel.prototype.setState = function ( state ) {
	this.state = state;
	this.emit( 'state' );
};

Cards.GameModel.prototype.getHand = function ( userId ) {
	return this.cards.hands[ userId ] || {
		property: [],
		money: [],
		hidden: 0
	};
};
