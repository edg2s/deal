Cards.CardView = function ( id ) {
	var color, $rent, actionData,
		cardView = this;

	Cards.CardView.super.call( this );

	this.model = new Cards.CardModel( id );
	this.location = location;

	this.$inner = $( '<div>' ).addClass( 'card-inner' );

	this.$element
		.addClass( 'card card-' + this.model.viewType )
		.append( this.$inner );

	switch ( this.model.viewType ) {
		case 'money':
			this.$element.addClass( 'card-money-' + this.model.value );
			this.$inner.append(
				$( '<div>' ).addClass( 'card-title' ).append(
					$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
				)
			);
			break;
		case 'property':
			color = this.model.name.replace( /[0-9]+/, '' );
			this.$element.addClass( 'card-property-' + color );

			$rent = $( '<ol>' );
			Cards.data.rent[ color ].forEach( function ( rent ) {
				$rent.append(
					$( '<li>' ).text( Cards.currency( rent ) )
				);
			} );

			this.$inner.append(
				$( '<div>' ).addClass( 'card-title' ).text( this.model.title ),
				$rent
			);
			break;
		case 'action':
			actionData = Cards.data.actions[ this.model.name ];

			this.$element.addClass( 'card-action-' + this.model.name );
			this.$inner.append(
				$( '<div>' ).addClass( 'card-title' ).append(
					$( '<div>' ).addClass( 'card-icon' ).text( actionData.icon ),
					$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
				),
				$( '<div>' ).addClass( 'card-description' ).text( actionData.description )
			);
			break;
		case 'wildcard':
			if ( this.model.name !== 'all' ) {
				this.model.name.split( '-' ).forEach( function ( color, i ) {
					$rent = $( '<ol>' );
					Cards.data.rent[ color ].forEach( function ( rent ) {
						$rent.append(
							$( '<li>' ).text( Cards.currency( rent ) )
						);
					} );
					cardView.$inner.append(
						$( '<div>' ).addClass( 'card-wildcard-' + i + ' card-property card-property-' + color ).append(
							$( '<div>' ).addClass( 'card-title' ).text( cardView.model.title ),
							$rent
						)
					);
				} );
			} else {
				this.$element.addClass( 'card-wildcard-all' );
				this.$inner.append(
					$( '<div>' ).addClass( 'card-title' ).append(
						$( '<div>' ).addClass( 'text' ).text( this.model.title )
					),
					$( '<div>' ).addClass( 'card-description' ).text(
						'This card can be used as part of any property set. This card has no monetary value.'
					)
				);
			}
			break;
		case 'rent':
			this.$inner.append(
				$( '<div>' ).addClass( 'card-title card-rent-' + this.model.name ).append(
					$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
				),
				$( '<div>' ).addClass( 'card-description' ).text(
					this.model.name === 'all' ?
						'Force one player to pay you rent for properties you own in one of these colors.' :
						'All players pay you rent for properties you own in one of these colors.'
				)
			);
			break;
	}

	if ( this.model.value ) {
		this.$inner.append(
			$( '<div>' ).addClass( 'card-value' ).text( Cards.currency( this.model.value ) ),
			$( '<div>' ).addClass( 'card-value' ).text( Cards.currency( this.model.value ) )
		);
	}
};

OO.inheritClass( Cards.CardView, OO.ui.Widget );
