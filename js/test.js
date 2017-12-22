// TODO Divide into init, create, update and animate functions

// General three.js setup


// INITIALISATION ------------------------------------------------------------

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(30, 10, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0 );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera );
controls.update();

// ADD GRID
var size = 100;
var divisions = 100;
var colorCenterLine = "0x444444"
var colorGrid = "0x000000"

var gridHelper = new THREE.GridHelper( size, divisions, "red", "gainsboro");
//scene.add( gridHelper );


// VISUAL FIELD PATH CONSTRUCTOR ---------------------------------------------
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


// CREATE VISUAL FIELD PATHS ------------------------------------------------
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

// RENDER LINES
var fieldList = [vRRU, vRRL, vRLU, vRLL].concat(switchList);
parent = new THREE.Object3D();
for (var i=0; i<8; i++) {
  var zOffset = (i-4) / 10;
  fieldList[i].renderPath(parent, new THREE.Color(colorList[i]), zOffset);
}
scene.add(parent);

// RAYCASTER ------------------------------------------------------------------

var raycaster = new THREE.Raycaster();
raycaster.linePrecision = 0.05;
var mouse = new THREE.Vector2();
function onMouseMove( event ) {
  event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );
sphere.visible=false;
scene.add( sphere );
var changed = []

function render() {

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( parent.children );

 for(i = 0; i<changed.length;i++) {
    if (!(changed[i] in intersects)) {
      changed[i].object.material.linewidth = 3;
      changed.splice(i, 1);
    }
  }

  if (intersects.length == 0) {
    sphere.visible = false;
  } else {
    for ( var i = 0; i < intersects.length; i++ ) {
      intersects[ i ].object.material.linewidth = 6;
      sphere.position.copy(intersects[ i ].point);
      changed.push(intersects[i]);
      sphere.visible = true;
    }
  }

	renderer.render( scene, camera );

}


// EVENT LISTENERS
window.addEventListener( 'mousemove', onMouseMove, false);
window.addEventListener( 'click', onClick, false);

var selectLines = []
function onClick( event ) {
  if (sphere.visible = true) {
    selectLines = changed;
    var sph_geometry = new THREE.SphereGeometry(1, 32, 32);
    var sph_material = new THREE.MeshBasicMaterial( {color:0xffff00});
    var selectSphere = new THREE.Mesh( geometry, material );
    selectSphere.position.copy(sphere.position);
    scene.add(selectSphere);
  }

}


// RENDER AND ANIMATE ----------------------------------------------------------
function animate() {

  requestAnimationFrame( animate );

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  render( scene, camera );

}

animate()









