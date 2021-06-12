Cards.HelpDialog = function () {
	Cards.HelpDialog.super.apply( this, arguments );
};

OO.inheritClass( Cards.HelpDialog, OO.ui.ProcessDialog );

Cards.HelpDialog.static.name = 'help';

Cards.HelpDialog.static.title = 'Help';

Cards.HelpDialog.static.size = 'larger';

Cards.HelpDialog.static.actions = [
	{ action: 'cancel', label: 'Cancel', flags: [ 'safe', 'close' ] }
];

Cards.HelpDialog.prototype.initialize = function () {

	this.contentPanel = new OO.ui.PanelLayout( {
		padded: true,
		classes: [ 'help-dialog' ]
	} );

	Cards.HelpDialog.super.prototype.initialize.apply( this, arguments );

	var types = {};
	var count = 1;
	var lastData, lastCard;
	Cards.data.cards.forEach( function ( data, card ) {
		var cardView;

		function compare( dataA, dataB ) {
			return OO.compare( dataA, dataB ) || (
				dataA && dataB &&
				dataA.viewType === 'property' && dataA.viewType === dataB.viewType &&
				dataA.color === dataB.color
			);
		}

		types[ data.viewType ] = types[ data.viewType ] || $( '<div>' ).addClass( 'card-group' );

		if ( !compare( lastData, data ) ) {
			count = 1;
			cardView = new Cards.CardView( card );
			cardView.$count = $( '<div>' ).addClass( 'card-count' );
			types[ data.viewType ].append( cardView.$element );
			lastCard = cardView;
		} else {
			count++;
			lastCard.$count.text( '×' + count ).appendTo( lastCard.$element );
		}
		lastData = data;
	} );
	for ( var type in types ) {
		this.contentPanel.$element.append(
			$( '<h3>' ).text( type ),
			types[ type ]
		);
	}

	this.$body.append( this.contentPanel.$element );
};

Cards.HelpDialog.prototype.getActionProcess = function ( action ) {
	var dialog = this;
	if ( action ) {
		return new OO.ui.Process( function () {
			dialog.close( { action: action } );
		} );
	}
	return Cards.HelpDialog.parent.prototype.getActionProcess.call( this, action );
};

OO.ui.getWindowManager().addWindows( [ new Cards.HelpDialog() ] );
