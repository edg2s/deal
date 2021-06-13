Cards.CardView = class CardView extends OO.ui.Widget {
	constructor( id ) {
		super();

		this.model = new Cards.CardModel( id );
		this.location = location;

		this.$inner = $( '<div>' ).addClass( 'card-inner' );

		this.$element
			.addClass( 'card card-' + this.model.viewType )
			.append( this.$inner );

		switch ( this.model.viewType ) {
			case 'money': {
				this.$element.addClass( 'card-money-' + this.model.value );
				this.$inner.append(
					$( '<div>' ).addClass( 'card-title' ).append(
						$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
					)
				);
				break;
			}
			case 'property': {
				this.$element.addClass( 'card-property-' + this.model.color );

				const $rent = $( '<ol>' );
				Cards.data.rent[ this.model.color ].forEach( ( rent ) => {
					$rent.append(
						$( '<li>' ).text( Cards.currency( rent ) )
					);
				} );

				this.$inner.append(
					$( '<div>' ).addClass( 'card-title' ).text( this.model.title ),
					$rent
				);
				break;
			}
			case 'action': {
				const actionData = Cards.data.actions[ this.model.name ];
				const description = typeof actionData.description === 'object' ?
					actionData.description[ Cards.locale ] :
					actionData.description;

				this.$element.addClass( 'card-action-' + this.model.name );
				this.$inner.append(
					$( '<div>' ).addClass( 'card-title' ).append(
						$( '<div>' ).addClass( 'card-icon' ).text( actionData.icon ),
						$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
					),
					$( '<div>' ).addClass( 'card-description' ).text( description )
				);
				break;
			}
			case 'wildcard': {
				if ( this.model.name !== 'all' ) {
					this.model.name.split( '-' ).forEach( ( color, i ) => {
						const $rent = $( '<ol>' );
						Cards.data.rent[ color ].forEach( ( rent ) => {
							$rent.append(
								$( '<li>' ).text( Cards.currency( rent ) )
							);
						} );
						this.$inner.append(
							$( '<div>' ).addClass( 'card-wildcard-' + i + ' card-property card-property-' + color ).append(
								$( '<div>' ).addClass( 'card-title' ).text( this.model.title ),
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
			}
			case 'rent': {
				const actionData = Cards.data.actions[ this.model.name === 'all' ? 'rentAll' : 'rent' ];
				const description = typeof actionData.description === 'object' ?
					actionData.description[ Cards.locale ] :
					actionData.description;

				this.$inner.append(
					$( '<div>' ).addClass( 'card-title card-rent-' + this.model.name ).append(
						$( '<div>' ).addClass( 'card-text' ).text( this.model.title )
					),
					$( '<div>' ).addClass( 'card-description' ).text( description )
				);
				break;
			}
		}

		if ( this.model.value ) {
			this.$inner.append(
				$( '<div>' ).addClass( 'card-value' ).text( Cards.currency( this.model.value ) ),
				$( '<div>' ).addClass( 'card-value' ).text( Cards.currency( this.model.value ) )
			);
		}
	}
};
