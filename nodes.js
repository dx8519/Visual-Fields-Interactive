class Node {
	constructor(name, rank) {
		this.name = name;
		this.rank = rank;
		this.parentsC=[];
		this.childrenC=[];
	}
}

class Connection {
	constructor(parent, child) {
		this.parent = parent;
		this.child = child;
		this.connected = true;
	}
}

var link = function(parent, child) {
	parent.children.push(new Connection(parent, child));
	child.parents.push(parent.sink);
}
	
var cut = function(parent, child) {
	for (i = 0; i<child.parentsC.length; i++) {
		if (child.parentsC[i].parent == parent) {
			child.parentsC[i].connected = false;
			break;
		}
	}
	for (i = 0; i<parent.childrenC.length; i++) {
		if (parent.childrenC[i].connected == true) {
			break;
		}
	}
	for (i = 0; i<parent.parentsC.length; i++) {
		cut(parent.parentsC[i].parent, parent);
	}
}
}
