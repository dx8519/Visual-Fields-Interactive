// TODO Divide into init, create, update and animate functions

// General three.js setup


// INITIALISATION ------------------------------------------------------------

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(30, 10, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer({alpha: true});
// Size is coded here for  css width of 50%
//containerWidth = window.innerWidth/2;
//containerHeight = window.innerHeight/2;
//renderer.setSize( containerWidth, containerHeight );
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

// OUTPUT FIELD CONSTRUCTOR -------------------------------------------------------
function OutputField(xPos, yPos, zPos) {
  var geometry = new THREE.PlaneGeometry( 2, 2, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

  this.plane = new THREE.Mesh( geometry, material );
  this.plane.rotation.set(0, Math.PI/2, 0)
  this.plane.position.x = xPos;
  this.plane.position.y = yPos;
  this.plane.position.z = zPos;
  this.renderField = renderField;
  function renderField(parent) {
    parent.add(this.plane);
  }
}



var oLLU = new OutputField(-3,1,6);
var oLRU = new OutputField(-3,1,4);
var oLLL = new OutputField(-3,-1,6);
var oLRL = new OutputField(-3,-1,4);
var oRLU = new OutputField(-3,1,-6);
var oRRU = new OutputField(-3,1,-4);
var oRLL = new OutputField(-3,-1,-6);
var oRRL = new OutputField(-3,-1,-4);

var outputs = new THREE.Object3D();
var outputList = [oLLU, oLRU, oLLL, oLRL, oRLU, oRRU, oRLL, oRRL];
for(var i = 0; i<outputList.length; i++) {
  outputList[i].renderField(outputs);
}
scene.add(outputs);

// VISUAL FIELD PATH CONSTRUCTOR ---------------------------------------------
function FieldPath (name, yPoints, zPoints) {
  this.name = name;
  this.xPoints = [];       // anterior-posterior
  this.yPoints = yPoints;  // superior-inferior
  this.zPoints = zPoints; //lateral-medial

  this.side = "right";
  // Need to assert yPoints.length = zPoints.length
  this.numPoints = yPoints.length
  this.switchSide = switchSide;
  this.renderPath = renderPath;
  this.material = new THREE.LineBasicMaterial({
      linewidth: 3,
      linecap: "round",
      linejoin: "round",
  });
  this.changeToDash = changeToDash;

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
    this.material.color.set(color)
    var zPointsOffset = this.zPoints.map(n => n + zOffset);
    var geometry = new THREE.Geometry();
    for (var i=0; i<this.numPoints; i++) {
      var xc = this.xPoints[i];
      var yc = this.yPoints[i];
      var zc = zPointsOffset[i];
      geometry.vertices.push(new THREE.Vector3(xc, yc, zc));
    }
    geometry.computeLineDistances();
    var line = new THREE.Line(geometry, this.material);
    parent.add(line);
  }

  function changeToDash() {
    this.material = new THREE.LineDashedMaterial({
      linewidth: 2,
      linecap: "round",
      linejoin: "round",
      dashSize: 0.2,
      gapSize: 0.05,
    })
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
var vRRU = new FieldPath ("RRU", yRU, zRU);
var vRRL = new FieldPath ("RRL", yRL, zRL);
var vRLU = new FieldPath ("RLU", yLU, zLU);
var vRLL = new FieldPath ("RLL", yLL, zLL);
// Need to check if this can be done in a more simple way
var vLRU = new FieldPath ("LRU", yRU, zRU);
var vLRL = new FieldPath ("LRL", yRL, zRL);
var vLLU = new FieldPath ("LLU", yLU, zLU);
var vLLL = new FieldPath ("LLL", yLL, zLL);
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

var offsetScale = 30;

// RENDER LINES BASES
var fieldList = [vRRU, vRRL, vRLU, vRLL].concat(switchList);
parent = new THREE.Object3D();
for (var i=0; i<8; i++) {
  var zOffset = (i-4) / offsetScale;
  fieldList[i].renderPath(parent, new THREE.Color(colorList[i]), zOffset);
}
scene.add(parent);

// RENDER LINE Lights
lights = new THREE.Object3D();
for (var i=0; i<8; i++) {
  var zOffset = (i-4) / offsetScale;
  fieldList[i].changeToDash();
  fieldList[i].renderPath(lights, new THREE.Color("yellow"), zOffset);
}
scene.add(lights);

// RAYCASTER ------------------------------------------------------------------

var raycaster = new THREE.Raycaster();
raycaster.linePrecision = 0.2;
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
  event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );
sphere.visible=false;
scene.add( sphere );
var changed = []

function render() {

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( lights.children );

 for(i = 0; i<changed.length;i++) {
    if (!(changed[i] in intersects)) {
      changed[i].object.material.linewidth = 2
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
window.addEventListener( 'dblclick', onDblClick, false);
//TODO Event Listener of window resize...
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


// ON RIGHT CLICK CLICK LISTENER
var sph_geometry = new THREE.SphereGeometry(0.5, 32, 32);
var sph_material = new THREE.MeshBasicMaterial( {color:0xff0000});
var selectSphere = new THREE.Mesh( sph_geometry, sph_material );
selectSphere.visible = false;
scene.add(selectSphere);
var selectLines = []
function onDblClick( event ) {

  event.preventDefault();
  event.stopPropagation();

  // Reset lights
  for (var i = 0; i<selectLines.length; i++) {
    obj = selectLines.pop()
    obj.material.visible= true;
    obj.material.needsUpdate = true;
    var outCoord = obj.geometry.vertices[0];
    var xComp = obj.geometry.vertices[0].x - 3; //Calibrate
    var yComp = obj.geometry.vertices[0].y;
    var zComp = obj.geometry.vertices[0].z;
    for (j = 0; j<outputs.children.length; j++) {
      var outPos = outputs.children[j].position;
      if (outPos.x == xComp && outPos.y == yComp && Math.abs(outPos.z - zComp) < 0.5) {
        outputs.children[j].material.color = new THREE.Color("yellow");
        outputs.children[j].material.needsUpdate = true;
        break;
      }
    }
  }

  if (sphere.visible == true) {
    selectSphere.position.copy(sphere.position);
    selectSphere.visible=true;

    for (var i = 0; i<changed.length; i++) {
      changed[i].object.material.visible = false;
      changed[i].object.material.needsUpdate = true;
      var xComp = changed[i].object.geometry.vertices[0].x - 3; //calibrate to output coordinate
      var yComp = changed[i].object.geometry.vertices[0].y;
      var zComp = changed[i].object.geometry.vertices[0].z;
      // Might do this with a base plane and light planes later
      for (j = 0; j<outputs.children.length; j++) {
        var outPos = outputs.children[j].position
        // Horrible if statement necessary because of z offsets...
        if (outPos.x == xComp && outPos.y == yComp && Math.abs(outPos.z - zComp) < 0.5) {
          outputs.children[j].material.color = new THREE.Color("grey");
          outputs.children[j].material.needsUpdate = true;
          break;
        }

      }
      selectLines.push(changed[i].object);
    }

  } else {
    selectSphere.position.copy(new THREE.Vector3(0,0,0));
    selectSphere.visible = false;
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









