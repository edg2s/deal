{
	const model = new Cards.GameModel();
	const view = new Cards.GameView( model );
	let userName = localStorage.getItem( 'cards-userName' );

	let promise = $.Deferred().resolve().promise();
	if ( !userName ) {
		promise = OO.ui.prompt( 'Enter your name' ).done( ( result ) => {
			userName = result || 'Anon ' + Math.floor( Math.random() * 1000 );
		} );
	}

	promise.then( () => {
		const socket = io( '', {
			query: {
				userId: localStorage.getItem( 'cards-userId' ) || Math.random(),
				room: Cards.roomName
			},
			transports: [ 'websocket' ]
		} );

		// eslint-disable-next-line no-jquery/no-global-selector
		const $game = $( '#game' );
		$game.append( view.$element );

		view.on( 'command', function () {
			const args = Array.prototype.slice.call( arguments );
			socket.emit.apply(
				socket,
				[ 'command' ].concat( args )
			);
		} );

		view.on( 'userName', () => {
			const newUserName = view.getUserName();
			if ( newUserName ) {
				// Never send a blank username
				socket.emit( 'command', 'userName', newUserName );
				localStorage.setItem( 'cards-userName', newUserName );
			}
		} );

		view.on( 'cardAction', function () {
			const args = Array.prototype.slice.call( arguments );
			socket.emit.apply(
				socket,
				[ 'cardAction' ].concat( args )
			);
		} );

		socket.on( 'init', ( userId ) => {
			localStorage.setItem( 'cards-userId', userId );
		} );

		socket.on( 'clear', () => {
			socket.emit( 'command', 'join' );
			socket.emit( 'command', 'userName', view.getUserName() );
			view.clearLog();
		} );

		socket.on( 'state', ( state ) => {
			model.setState( state );
		} );

		socket.on( 'users', ( users ) => {
			model.setUsers( users );
		} );

		socket.on( 'cards', ( cards ) => {
			model.setCards( cards );
		} );

		socket.on( 'hand', ( hand ) => {
			model.setHand( hand );
		} );

		socket.on( 'log', ( message, type ) => {
			view.log( message, type );
		} );

		socket.on( 'sound', ( sounds, spacing ) => {
			if ( view.audioToggle.isSelected() ) {
				Cards.playSequence( sounds, spacing );
			}
		} );

		socket.emit( 'command', 'join' );
		view.userNameInput.setValue( userName );
	} );

	// Expose
	Cards.view = view;
}
