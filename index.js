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

	return app;
}

function createModel( context ) {
	const model = new Model();

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
			context = {},
			room = socket.handshake.query.room,
			userName = socket.handshake.query.userName,
			// token = socket.handshake.query.token,
			userId = socket.handshake.query.userId;

		context.emit = socket.emit.bind( socket );
		context.broadcoast = io.emit.bind( io );

		// Store username
		console.log( 'User ' + userName + ' connected' );
		context.emit( 'init', userId );

		socket.join( room );
		models[ room ] = models[ room ] || createModel( context );

		const model = models[ room ];

		// Only send hidden cards to the user
		model.on( 'cards', () => {
			context.emit( 'hand', model.getHand( userId ).hidden );
		} );

		// Initial broadcast
		model.emit( 'cards' );
		model.emit( 'users' );
		model.emit( 'state' );

		socket.on( 'command', ( command ) => {
			switch ( command ) {
				case 'join':
					model.addUser( userId, userName );
					break;
				case 'clear':
					model.clear();
					context.broadcoast( 'clear' );
					break;
				case 'start':
					model.start();
					break;
				case 'draw':
					model.deal( userId, 2 );
					break;
			}
		} );

		socket.on( 'cardAction', ( command, ...args ) => {
			switch ( command ) {
				case 'property':
				case 'money':
				case 'action':
				case 'passProperty':
				case 'passMoney':
				case 'undo':
				case 'discard':
				case 'reorder':
					model[ command ].apply( model, [ userId ].concat( args ) );
					break;
			}
		} );

		socket.on( 'disconnect', function () {
			console.log( 'User ' + userName + ' disconnected' );
		} );
	} );
}

createServer( initApp() );
