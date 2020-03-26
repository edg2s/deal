window.Cards = {
	locale: 'gb',
	currency: function ( value ) {
		return Cards.data.currency[ Cards.locale ] + value + 'm';
	},
	audio: {
		card: new Audio( '../audio/card.mp3' ),
		shuffle: new Audio( '../audio/shuffle.mp3' )
	},
	playSequence: function ( sounds, spacing ) {
		var sound = Cards.audio[ sounds[ 0 ] ].cloneNode();
		if ( sounds.length > 1 ) {
			if ( spacing ) {
				setTimeout( function () {
					Cards.playSequence( sounds.slice( 1 ), spacing );
				}, spacing );
			} else {
				$( sound ).one( 'ended', function () {
					Cards.playSequence( sounds.slice( 1 ) );
				} );
			}
		}
		sound.volume = 0.5;
		sound.play();
	}
};
