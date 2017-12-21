class Node {
	constructor(name, rank) {
		this.name = name;
		this.rank = rank;
		this.source=[];
		this.sink=[];
		
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
	parent.sink.push(new Connection(parent, child));
	child.source.push(parent.sink);
}
	
var cut = function(connections[]) {
	
