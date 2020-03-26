( function () {
	var pieces = [
			'boot',
			'thimble',
			'iron',
			'car',
			'hat',
			'dog'
		],
		roomNameInput = new OO.ui.TextInputWidget( {
			placeholder: 'Room name (optional)'
		} ),
		submitButton = new OO.ui.ButtonWidget( {
			label: 'Join / Start',
			flags: [ 'primary', 'progressive' ]
		} ),
		roomNameField = new OO.ui.ActionFieldLayout( roomNameInput, submitButton, {
			align: 'top'
		} );

	function random( n ) {
		return Math.floor( Math.random() * n );
	}

	function onSubmit() {
		var docName = roomNameInput.getValue().trim() ||
			( pieces[ random( pieces.length ) ] + ( random( 9000 ) + 1000 ) );

		if ( docName ) {
			window.location.href = '/game/' + encodeURIComponent( docName );
		} else {
			roomNameInput.focus();
		}
	}

	submitButton.on( 'click', onSubmit );
	roomNameInput.on( 'enter', onSubmit );

	$( document.body ).append( roomNameField.$element );

	roomNameInput.focus();

}() );
