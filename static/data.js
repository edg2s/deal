Cards.data = {};

Cards.data.cardTypes = [
	{
		type: 'action',
		name: 'breaker',
		value: 5,
		count: 2
	},
	{
		type: 'action',
		name: 'collector',
		value: 3,
		count: 3
	},
	{
		type: 'action',
		name: 'double',
		value: 1,
		count: 2
	},
	{
		type: 'action',
		name: 'forced',
		value: 3,
		count: 3
	},
	{
		// Looks like an action, behaves like a property
		type: 'property',
		viewType: 'action',
		name: 'hotel',
		value: 4,
		count: 2
	},
	{
		// Looks like an action, behaves like a property
		type: 'property',
		viewType: 'action',
		name: 'house',
		value: 3,
		count: 3
	},
	{
		type: 'action',
		name: 'birthday',
		value: 2,
		count: 3
	},
	{
		type: 'action',
		name: 'no',
		value: 4,
		count: 3
	},
	{
		type: 'action',
		name: 'go',
		value: 1,
		count: 10
	},
	{
		type: 'action',
		name: 'sly',
		value: 3,
		count: 3
	},
	{
		type: 'money',
		name: '',
		value: 10,
		count: 1
	},
	{
		type: 'money',
		name: '',
		value: 5,
		count: 2
	},
	{
		type: 'money',
		name: '',
		value: 4,
		count: 3
	},
	{
		type: 'money',
		name: '',
		value: 3,
		count: 3
	},
	{
		type: 'money',
		name: '',
		value: 2,
		count: 5
	},
	{
		type: 'money',
		name: '',
		value: 1,
		count: 6
	},
	{
		type: 'property',
		name: 'brown1',
		value: 1,
		count: 1
	},
	{
		type: 'property',
		name: 'brown2',
		value: 1,
		count: 1
	},
	{
		type: 'property',
		name: 'lblue1',
		value: 1,
		count: 1
	},
	{
		type: 'property',
		name: 'lblue2',
		value: 1,
		count: 1
	},
	{
		type: 'property',
		name: 'lblue3',
		value: 1,
		count: 1
	},
	{
		type: 'property',
		name: 'pink1',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'pink2',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'pink3',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'orange1',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'orange2',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'orange3',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'red1',
		value: 3,
		count: 1
	},
	{
		type: 'property',
		name: 'red2',
		value: 3,
		count: 1
	},
	{
		type: 'property',
		name: 'red3',
		value: 3,
		count: 1
	},
	{
		type: 'property',
		name: 'yellow1',
		value: 3,
		count: 1
	},
	{
		type: 'property',
		name: 'yellow2',
		value: 3,
		count: 1
	},
	{
		type: 'property',
		name: 'yellow3',
		value: 3,
		count: 1
	},
	{
		type: 'property',
		name: 'green1',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		name: 'green2',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		name: 'green3',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		name: 'dblue1',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		name: 'dblue2',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		name: 'station1',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'station2',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'station3',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'station4',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'utility1',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		name: 'utility2',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'dblue-green',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'lblue-brown',
		value: 1,
		count: 1
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'orange-pink',
		value: 2,
		count: 2
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'lblue-station',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'utility-station',
		value: 2,
		count: 1
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'yellow-red',
		value: 3,
		count: 2
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'green-station',
		value: 4,
		count: 1
	},
	{
		type: 'property',
		viewType: 'wildcard',
		name: 'all',
		value: 0,
		count: 2
	},
	{
		type: 'action',
		viewType: 'rent',
		name: 'dblue-green',
		value: 1,
		count: 2
	},
	{
		type: 'action',
		viewType: 'rent',
		name: 'lblue-brown',
		value: 1,
		count: 2
	},
	{
		type: 'action',
		viewType: 'rent',
		name: 'orange-pink',
		value: 1,
		count: 2
	},
	{
		type: 'action',
		viewType: 'rent',
		name: 'utility-station',
		value: 1,
		count: 2
	},
	{
		type: 'action',
		viewType: 'rent',
		name: 'yellow-red',
		value: 1,
		count: 2
	},
	{
		type: 'action',
		viewType: 'rent',
		name: 'all',
		value: 3,
		count: 3
	}
];

Cards.data.cards = [];

Cards.data.cardTypes.forEach( ( card ) => {
	for ( let i = 0; i < card.count; i++ ) {
		const data = {
			type: card.type,
			viewType: card.viewType || card.type,
			name: card.name,
			value: card.value
		};
		if ( data.viewType === 'property' ) {
			data.color = data.name.replace( /[0-9]+/, '' );
		}

		Cards.data.cards.push( data );
	}
} );

Cards.data.properties = {
	us: {
		brown1: 'Mediterranean Avenue',
		brown2: 'Baltic Avenue',
		lblue1: 'Oriental Avenue',
		lblue2: 'Vermont Avenue',
		lblue3: 'Connecticut Avenue',
		pink1: 'St. Charles Place',
		pink2: 'States Avenue',
		pink3: 'Virginia Avenue',
		orange1: 'St. James Place',
		orange2: 'Tennessee Avenue',
		orange3: 'New York Avenue',
		red1: 'Kentucky Avenue',
		red2: 'Indiana Avenue',
		red3: 'Illinois Avenue',
		yellow1: 'Atlantic Avenue',
		yellow2: 'Ventnor Avenue',
		yellow3: 'Marvin Gardens',
		green1: 'Pacific Avenue',
		green2: 'North Carolina Avenue',
		green3: 'Pennsylvania Avenue',
		dblue1: 'Park Place',
		dblue2: 'Broadwalk',
		station1: 'Reading Railroad',
		station2: 'Pennsylvania Railroad',
		station3: 'B. & O. Railroad',
		station4: 'Short Line',
		utility1: 'Electric Company',
		utility2: 'Water Works',
		wild: 'Property wild card'
	},
	gb: {
		brown1: 'Old Kent Road',
		brown2: 'Whitechapel Road',
		lblue1: 'The Angel, Islington',
		lblue2: 'Euston Road',
		lblue3: 'Pentonville Road',
		pink1: 'Pall Mall',
		pink2: 'Whitehall',
		pink3: 'Northumberland Avenue',
		orange1: 'Bow Street',
		orange2: 'Marlborough Street',
		orange3: 'Vine Street',
		red1: 'Strand',
		red2: 'Fleet Street',
		red3: 'Trafalgar Square',
		yellow1: 'Leicester Square',
		yellow2: 'Coventry Street',
		yellow3: 'Piccadilly',
		green1: 'Regent Street',
		green2: 'Oxford Street',
		green3: 'Bond Street',
		dblue1: 'Park Lane',
		dblue2: 'Mayfair',
		station1: 'King\'s Cross Station',
		station2: 'Marylebone Station',
		station3: 'Fenchurch Street Station',
		station4: 'Liverpool Street Station',
		utility1: 'Electric Company',
		utility2: 'Water Works',
		wild: 'Property wild card'
	}
};

Cards.data.rent = {
	brown: [ 1, 2 ],
	lblue: [ 1, 2, 3 ],
	pink: [ 1, 2, 4 ],
	orange: [ 1, 3, 5 ],
	red: [ 2, 3, 6 ],
	yellow: [ 2, 4, 6 ],
	green: [ 2, 4, 7 ],
	dblue: [ 3, 8 ],
	station: [ 1, 2, 3, 4 ],
	utility: [ 1, 2 ]
};

Cards.data.currency = {
	gb: '£',
	us: '$'
};

Cards.data.actions = {
	breaker: {
		title: 'Deal breaker',
		description: 'Steal a complete set of properties from any player. (Includes any buildings.)',
		icon: '🔨'
	},
	collector: {
		title: 'Debt collector',
		description: 'Force any player to pay you ' + Cards.currency( 5 ) + '.',
		icon: '💰'
	},
	double: {
		title: 'Double the rent!',
		description: 'Needs to be played with a rent card.',
		icon: '×2'
	},
	forced: {
		title: 'Forced deal',
		description: 'Swap any property with another player. (Cannot be part of a full set.)',
		icon: '💪'
	},
	hotel: {
		title: 'Hotel',
		description: {
			gb: 'Add onto any full set you own to add ' + Cards.currency( 4 ) + ' to the rent value. (Except stations and utilities.)',
			us: 'Add onto any full set you own to add ' + Cards.currency( 4 ) + ' to the rent value. (Except railroads and utilities.)'
		},
		icon: '🏨'
	},
	house: {
		title: 'House',
		description: {
			gb: 'Add onto any full set you own to add ' + Cards.currency( 3 ) + ' to the rent value. (Except stations and utilities.)',
			us: 'Add onto any full set you own to add ' + Cards.currency( 3 ) + ' to the rent value. (Except railroads and utilities.)'
		},
		icon: '🏠'
	},
	birthday: {
		title: 'It\'s my birthday',
		description: 'All players give you ' + Cards.currency( 2 ) + ' as a "gift".',
		icon: '🎁'
	},
	no: {
		title: 'Just say no!',
		description: 'Use any time when an action card is played against you.',
		icon: '✋'
	},
	go: {
		title: 'Pass GO',
		description: 'Draw 2 extra cards.',
		icon: '↩️'
	},
	sly: {
		title: 'Sly deal',
		description: 'Steal a property from the player of your choice. (Cannot be part of a full set.)',
		icon: '🤫'
	},
	rentAll: {
		// 'All' means all colours
		description: {
			gb: 'Force one player to pay you rent for properties you own in one of these colours.',
			us: 'Force one player to pay you rent for properties you own in one of these colors.'
		}
	},
	rent: {
		description: {
			gb: 'All players pay you rent for properties you own in one of these colours.',
			us: 'All players pay you rent for properties you own in one of these colors.'
		}
	}
};
