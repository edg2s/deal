Cards.DroppableView = function () {
	this.droppable = false;

	this.$element.on( {
		'dragover dragenter': this.onDroppableOverOrEnter.bind( this ),
		dragleave: this.onDroppableLeave.bind( this ),
		drop: this.onDroppableDrop.bind( this )
	} );
};

OO.initClass( Cards.DroppableView );

Cards.DroppableView.prototype.isDroppable = function () {
	return true;
};

Cards.DroppableView.prototype.drop = function () {};

Cards.DroppableView.prototype.onDroppableOverOrEnter = function ( e ) {
	this.droppable = this.isDroppable();

	if ( this.droppable ) {
		this.$element.addClass( 'droppable' );
		e.preventDefault();
	}
};

Cards.DroppableView.prototype.onDroppableLeave = function () {
	this.droppable = false;
	// Avoid flicker
	setTimeout( () => {
		if ( !this.droppable ) {
			this.$element.removeClass( 'droppable' );
		}
	}, 50 );
};

Cards.DroppableView.prototype.onDroppableDrop = function () {
	if ( !this.droppable ) {
		return;
	}
	this.droppable = false;
	this.$element.removeClass( 'droppable' );

	this.drop();
};
