Cards.HelpDialog = class HelpDialog extends OO.ui.ProcessDialog {
	initialize() {
		this.contentPanel = new OO.ui.PanelLayout( {
			padded: true,
			classes: [ 'help-dialog' ]
		} );

		super.initialize( ...arguments );

		const types = {};
		let count = 1;
		let lastData, lastCard;
		Cards.data.cards.forEach( ( data, card ) => {
			let cardView;

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
		for ( const type in types ) {
			this.contentPanel.$element.append(
				$( '<h3>' ).text( type ),
				types[ type ]
			);
		}

		this.$body.append( this.contentPanel.$element );
	}

	getActionProcess( action ) {
		if ( action ) {
			return new OO.ui.Process( () => {
				this.close( { action: action } );
			} );
		}
		return super.getActionProcess( action );
	}
};

Cards.HelpDialog.static.name = 'help';

Cards.HelpDialog.static.title = 'Help';

Cards.HelpDialog.static.size = 'larger';

Cards.HelpDialog.static.actions = [
	{ action: 'cancel', label: 'Cancel', flags: [ 'safe', 'close' ] }
];

OO.ui.getWindowManager().addWindows( [ new Cards.HelpDialog() ] );
