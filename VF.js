class VF {
	constructor(side, vertical, horizontal, radius) {
		this.side = side;
		this.vertical = vertical;
		this.horizontal = horizontal;
		this.radius = radius;
		this.on = true;
	}
}

class Bundle {
	constructor() {
		this.fields = []
	}
}

var addToBundle = function(visualField) {
	

var cut= function(bundle) {
	for (i = 0; i<bundle.fields.length; i++) {
		bundle.fields[i].on = false;
	}
}

var restore= function(bundle) {
	for (i = 0; i<bundle.fields.length; i++) {
		bundle.fields[i].on = true;
}

