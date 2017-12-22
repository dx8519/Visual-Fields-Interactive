// TODO Divide into init, create, update and animate functions

// General three.js setup

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(30, 10, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0 );
document.body.appendChild( renderer.domElement );

// Figure this out
var controls = new THREE.OrbitControls( camera );
controls.update();


// VISUAL FIELD PATH CONSTRUCTOR
function FieldPath (yPoints, zPoints) {
  this.xPoints = [];       // anterior-posterior
  this.yPoints = yPoints;  // superior-inferior
  this.zPoints = zPoints; //lateral-medial

  this.side = "right";
  // Need to assert yPoints.length = zPoints.length
  this.numPoints = yPoints.length
  this.switchSide = switchSide;
  this.renderPath = renderPath;

  // Initialise xPoints with integers from 0 to numLength
  for (var i=0; i<this.numPoints; i++) {
    this.xPoints.push(2*i);
  }

  function switchSide() {
    this.zPoints = this.zPoints.map(n => n * (-1));
    switch(this.side) {
      case "right":
        this.side = "left";
        break;
      case "left":
        this.side = "right";
        break;
    }
  }

  function renderPath(parent, color, zOffset) {
    // zOffset to show all lines without superimposition
    var zPointsOffset = this.zPoints.map(n => n + zOffset);
    var material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 3,
      linecap: "round",
      linejoin: "round",
    });
    var geometry = new THREE.Geometry();
    for (var i=0; i<this.numPoints; i++) {
      var xc = this.xPoints[i];
      var yc = this.yPoints[i];
      var zc = zPointsOffset[i];
      geometry.vertices.push(new THREE.Vector3(xc, yc, zc));
    }
    geometry.computeLineDistances();
    var line = new THREE.Line(geometry, material);
    parent.add(line);
  }
}



// Initialise generic paths
var yRU = [1, -1, 0, 0, 0, -4, 0];
var zRU = [6, 4, 5, 0, -5, -5, -2];

var yRL = [-1, 1, 0, 0, 0, 4, 0];
var zRL = [6, 4, 5, 0, -5, -5, -2];

var yLU = yRU;
var zLU = [4, 6, 5, 5, 5, 5, 2];

var yLL = yRL;
var zLL = [4, 6, 5, 5, 5, 5, 2];

// Create visual field objects
var vRRU = new FieldPath (yRU, zRU);
var vRRL = new FieldPath (yRL, zRL);
var vRLU = new FieldPath (yLU, zLU);
var vRLL = new FieldPath (yLL, zLL);
// Need to check if this can be done in a more simple way
var vLRU = new FieldPath (yRU, zRU);
var vLRL = new FieldPath (yRL, zRL);
var vLLU = new FieldPath (yLU, zLU);
var vLLL = new FieldPath (yLL, zLL);
// Objects apparently passed by reference so this should work...
var switchList = [vLLU, vLLL, vLRU, vLRL];
for (var i=0; i<switchList.length; i++) {
  switchList[i].switchSide();
}

// Generate colours
var colorList = [];
colorList.push("lightgreen", "lightseagreen", "lightskyblue", "mediumpurple");
colorList.push("lightsalmon", "crimson", "sienna", "hotpink");
// TODO: Figure out a good way to get colors automatically
// for (var i=0; i<8; i++) {
//   var rprop = 0.1 + (i%2);
//   var gprop = 0.1 + (Math.floor(i/4));
//   var bprop = 0.1 + (Math.floor((i/2)%2));
//   var sum = 2 * (rprop + gprop + bprop);
//   rprop = (rprop/sum);
//   gprop = (gprop/sum);
//   bprop = (bprop/sum);
//   var color = new THREE.Color(rprop, gprop, bprop);
//   colorList.push(color);
// }



// RENDER LINES
var fieldList = [vRRU, vRRL, vRLU, vRLL].concat(switchList);
var parent = new THREE.Object3D();
for (var i=0; i<8; i++) {
  var zOffset = (i-4) / 10;
  fieldList[i].renderPath(parent, new THREE.Color(colorList[i]), zOffset);
}


scene.add(parent);


// ADD GRID
var size = 100;
var divisions = 100;
var colorCenterLine = "0x444444"
var colorGrid = "0x000000"

var gridHelper = new THREE.GridHelper( size, divisions, "red", "gainsboro");
scene.add( gridHelper );

// RENDER AND ANIMATE
function animate() {

  requestAnimationFrame( animate );

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render( scene, camera );

}

animate();
