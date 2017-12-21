class VF {
	constructor(side, vertical, horizontal, radius) {
		this.side = side;
		this.vertical = vertical;
		this.horizontal = horizontal;
		this.radius = radius;
	}
}

class Bundle {
	constructor() {
		this.fields = []
	}
}

var addToBundle = function(visualField) {
	