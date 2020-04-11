const
	express = require( 'express' ),
	http = require( 'http' ),
	socketIO = require( 'socket.io' ),
	Model = require( './Model' ),
	models = {};

function initApp() {
	const app = express();
	app.use( express.static( __dirname + '/static' ) );
	app.set( 'view engine', 'ejs' );

	app.get( '/', ( req, res ) => {
		res.render( 'index' );
	} );

	// eslint-disable-next-line prefer-regex-literals
	app.get( new RegExp( '/game/(.*)' ), ( req, res ) => {
		var roomName = req.params[ 0 ];

		if ( roomName !== roomName.toLowerCase() ) {
			res.redirect( '/game/' + roomName.toLowerCase() );
			return;
		}
		res.render( 'game', { roomName: roomName } );
	} );

	return app;
}

function createModel( context, roomName ) {
	const model = new Model( roomName );

	model.on( 'users', () => {
		context.broadcoast( 'users', model.users );
	} );

	model.on( 'cards', () => {
		context.broadcoast( 'cards', model.getVisibleCards() );
	} );

	model.on( 'state', () => {
		context.broadcoast( 'state', model.state );
	} );

	model.on( 'log', ( message ) => {
		context.broadcoast( 'log', message );
	} );

	return model;
}

function createServer( app ) {
	const server = http.createServer( app ).listen( 3003, () => {
		console.log( 'listening on *:3003' );
	} );
	const io = socketIO( server );
	io.on( 'connection', ( socket ) => {
		const
			roomName = socket.handshake.query.room,
			// token = socket.handshake.query.token,
			userId = socket.handshake.query.userId;

		socket.join( roomName );

		const context = {
			emit: socket.emit.bind( socket ),
			broadcoast: function () {
				const room = io.sockets.in( roomName );
				room.emit.apply( room, arguments );
			}
		};

		// Store username
		console.log( roomName + ': User ' + userId + ' connected' );
		context.emit( 'init', userId );

		models[ roomName ] = models[ roomName ] || createModel( context, roomName );

		const model = models[ roomName ];

		// Only send hidden cards to the user
		model.on( 'cards', () => {
			context.emit( 'hand', model.getHand( userId ).hidden );
		} );

		// Initial broadcast
		model.emit( 'cards' );
		model.emit( 'users' );
		model.emit( 'state' );

		socket.on( 'command', ( command, ...args ) => {
			switch ( command ) {
				case 'join':
					model.addUser( userId );
					break;
				case 'clear':
					model.clear();
					context.broadcoast( 'clear' );
					context.broadcoast( 'sound', [ 'shuffle' ] );
					break;
				case 'start':
					model.start();
					context.broadcoast( 'sound', [ 'card', 'card', 'card', 'card' ], 150 );
					break;
				case 'draw':
					model.deal( userId, 2 );
					context.broadcoast( 'sound', [ 'card', 'card' ], 300 );
					break;
				case 'userName':
					model.setUserName( userId, args[ 0 ] );
					break;
			}
		} );

		socket.on( 'cardAction', ( command, ...args ) => {
			switch ( command ) {
				case 'property':
				case 'money':
				case 'action':
				case 'rotate':
				case 'passProperty':
				case 'passMoney':
				case 'undo':
				case 'discard':
				case 'reorder':
					model[ command ].apply( model, [ userId ].concat( args ) );
					break;
			}
			switch ( command ) {
				case 'property':
				case 'money':
				case 'action':
				case 'passProperty':
				case 'passMoney':
				case 'undo':
				case 'discard':
					context.broadcoast( 'sound', [ 'card' ] );
					break;
			}
		} );

		socket.on( 'disconnect', function () {
			console.log( roomName + ': User ' + userId + ' disconnected' );
		} );
	} );
}

createServer( initApp() );
