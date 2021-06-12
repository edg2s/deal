( function () {
	var model = new Cards.GameModel();
	var view = new Cards.GameView( model );
	var userName = localStorage.getItem( 'cards-userName' );

	var promise = $.Deferred().resolve().promise();
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

		// eslint-disable-next-line no-jquery/no-global-selector
		var $game = $( '#game' );
		$game.append( view.$element );

		view.on( 'command', function () {
			var args = Array.prototype.slice.call( arguments );
			socket.emit.apply(
				socket,
				[ 'command' ].concat( args )
			);
		} );

		view.on( 'userName', function () {
			var newUserName = view.getUserName();
			if ( newUserName ) {
				// Never send a blank username
				socket.emit( 'command', 'userName', newUserName );
				localStorage.setItem( 'cards-userName', newUserName );
			}
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
			view.clearLog();
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

		socket.on( 'log', function ( message, type ) {
			view.log( message, type );
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
