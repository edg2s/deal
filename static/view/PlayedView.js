Cards.PlayedView = function ( gameView ) {
	Cards.PlayedView.super.call( this );

	this.gameView = gameView;

	this.$element.addClass( 'game-played' );
};

OO.inheritClass( Cards.PlayedView, OO.ui.Widget );

Cards.PlayedView.prototype.update = function () {
	var view = this;

	this.$element.empty();

	this.gameView.model.cards.played.slice( -3 ).forEach( function ( id ) {
		var cardView = new Cards.CardView( view.gameView, id, 'played' );
		cardView.on( 'action', view.emit.bind( view, 'cardAction' ) );
		view.$element.append( cardView.$element );
	} );
};
