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
    for (i=0; i<this.numPoints; i++) {
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

  function renderPath(parent) {
    // TODO Assign each line a unique colour
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var geometry = new THREE.Geometry();
    for (i=0; i<this.numPoints; i++) {
      var xc = this.xPoints[i];
      var yc = this.yPoints[i];
      var zc = this.zPoints[i];
      geometry.vertices.push(new THREE.Vector3(xc, yc, zc));
    }
    var line = new THREE.Line(geometry, material);
    parent.add(line);
  }
}



// Initialise generic paths
// TODO: Change field path to y dimension for first value
var yRU = [0, 0, 0, 0, 0, 4, 0];
var zRU = [8, 4, 5, 0, -5, -5, -2];

var yRL = yRU.map(n => n * (-1));
var zRL = [6, 2, 5, 0, -5, -5, -2];

var yLU = yRU;
var zLU = [4, 8, 5, 5, 5, 5, 2];

var yLL = yRL;
var zLL = [2, 6, 5, 5, 5, 5, 2];

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
var switchList = [vLRU, vLRL, vLLU, vLLL];
for (i=0; i<switchList.length; i++) {
  switchList[i].switchSide();
}

// RENDER LINES
var fieldList = [vRRU, vRRL, vRLU, vRLL].concat(switchList);
var parent = new THREE.Object3D();
for (i=0; i<8; i++) {
  fieldList[i].renderPath(parent);
}

// WHY does this work and not the above loop?
fieldList[0].renderPath(parent);
fieldList[1].renderPath(parent);
fieldList[2].renderPath(parent);
fieldList[3].renderPath(parent);
fieldList[4].renderPath(parent);
fieldList[5].renderPath(parent);
fieldList[6].renderPath(parent);
fieldList[7].renderPath(parent);

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
