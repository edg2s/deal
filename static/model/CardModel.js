Cards.CardModel = function ( id ) {
	var data = Cards.data.cards[ id ];
	this.id = id;
	this.value = data.value;
	this.type = data.type;
	this.name = data.name;

	switch ( data.type ) {
		case 'money':
			this.title = Cards.currency( data.value );
			break;
		case 'property':
			this.title = Cards.data.properties[ Cards.locale ][ data.name ];
			break;
		case 'action':
			this.title = Cards.data.actions[ data.name ].title;
			break;
		case 'wildcard':
			this.title = 'Property wild card';
			break;
		case 'rent':
			this.title = 'Rent';
			break;
	}
};

OO.initClass( Cards.CardModel );