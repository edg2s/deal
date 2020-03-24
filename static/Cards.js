window.Cards = {
	locale: 'gb',
	currency: function ( value ) {
		return Cards.data.currency[ Cards.locale ] + value + 'm';
	}
};
