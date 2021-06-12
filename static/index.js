{
	const pieces = [
		'boot',
		'thimble',
		'iron',
		'car',
		'hat',
		'dog'
	];
	const roomNameInput = new OO.ui.TextInputWidget( {
		placeholder: 'Room name (optional)'
	} );
	const submitButton = new OO.ui.ButtonWidget( {
		label: 'Join / Start',
		flags: [ 'primary', 'progressive' ]
	} );
	const roomNameField = new OO.ui.ActionFieldLayout( roomNameInput, submitButton, {
		align: 'top'
	} );

	const random = function ( n ) {
		return Math.floor( Math.random() * n );
	};

	const onSubmit = function () {
		const docName = roomNameInput.getValue().trim() ||
			( pieces[ random( pieces.length ) ] + ( random( 9000 ) + 1000 ) );

		if ( docName ) {
			window.location.href = '/game/' + encodeURIComponent( docName );
		} else {
			roomNameInput.focus();
		}
	};

	submitButton.on( 'click', onSubmit );
	roomNameInput.on( 'enter', onSubmit );

	$( document.body ).append( roomNameField.$element );

	roomNameInput.focus();
}
