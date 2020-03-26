( function () {
	var promise = $.Deferred().resolve().promise(),
		model = new Cards.GameModel(),
		view = new Cards.GameView( model ),
		userName = localStorage.getItem( 'cards-userName' ),
		// eslint-disable-next-line no-jquery/no-global-selector
		$game = $( '#game' );

	if ( !userName ) {
		promise = OO.ui.prompt( 'Enter your name' ).done( function ( result ) {
			userName = result || 'Anon ' + Math.floor( Math.random() * 1000 );
		} );
	}

	promise.then( function () {
		var socket = io( '', {
			query: {
				userId: localStorage.getItem( 'cards-userId' ) || Math.random(),
				room: Cards.roomName
			},
			transports: [ 'websocket' ]
		} );

		$game.append( view.$element );

		view.on( 'command', function ( arg ) {
			socket.emit( 'command', arg );
		} );

		view.on( 'userName', function () {
			var userName = view.getUserName();
			socket.emit( 'command', 'userName', userName );
			localStorage.setItem( 'cards-userName', userName );
		} );

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
			socket.emit( 'command', 'userName', view.getUserName() );
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

		socket.on( 'sound', function ( sounds, spacing ) {
			if ( view.audioToggle.isSelected() ) {
				Cards.playSequence( sounds, spacing );
			}
		} );

		socket.emit( 'command', 'join' );
		view.userNameInput.setValue( userName );
	} );

	// Expose
	Cards.view = view;
}() );
