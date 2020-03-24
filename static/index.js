( function () {
	var promise = $.Deferred().resolve().promise(),
		model = new Cards.ClientModel(),
		view = new Cards.ClientView( model ),
		userName = localStorage.getItem( 'cards-userName' ),
		// eslint-disable-next-line no-jquery/no-global-selector
		$game = $( '#game' );

	if ( !userName ) {
		promise = OO.ui.prompt( 'Enter your name' ).done( function ( result ) {
			userName = result || 'Anon ' + Math.floor( Math.random() * 1000 );
			localStorage.setItem( 'cards-userName', userName );
		} );
	}

	promise.then( function () {
		var socket = io( '', {
			query: {
				userId: localStorage.getItem( 'cards-userId' ) || Math.random(),
				userName: userName,
				room: 'room1'
			},
			transports: [ 'websocket' ]
		} );

		$game.append(
			view.$element
		);

		view.on( 'command', function ( arg ) {
			socket.emit( 'command', arg );
		} );

		socket.emit( 'command', 'join' );

		view.on( 'cardAction', function () {
			var args = Array.prototype.slice.call( arguments );
			socket.emit.apply(
				socket,
				[ 'cardAction' ].concat( args )
			);
		} );

		socket.on( 'init', function ( userId ) {
			localStorage.setItem( 'cards-userId', userId );
		} );

		socket.on( 'clear', function () {
			socket.emit( 'command', 'join' );
		} );

		socket.on( 'state', function ( state ) {
			model.setState( state );
		} );

		socket.on( 'users', function ( users ) {
			model.setUsers( users );
		} );

		socket.on( 'cards', function ( cards ) {
			model.setCards( cards );
		} );

		socket.on( 'hand', function ( hand ) {
			model.setHand( hand );
		} );

		socket.on( 'log', function ( message ) {
			view.log( message );
		} );

	} );
}() );
