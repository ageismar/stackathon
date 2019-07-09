var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container;

var camera, scene;
var renderer;

var mesh;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

var gui, skinConfig, morphConfig;

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);

init();
animate();

function init() {
  container = document.getElementById('container');

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(5000, 5000, 5000);

  scene = new THREE.Scene();

  // LIGHTS

  var light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container.appendChild(renderer.domElement);

  // CHARACTER

  character = new THREE.UCSCharacter();

  //};

  var loader = new THREE.XHRLoader();

  loader.load(
    './takahirox.github.io/three.js.mmdeditor/examples/models/skinned/UCS_config.json',
    function(text) {
      var config = JSON.parse(text);
      character.loadParts(config);

      scene.add(character.root);
    }
  );

  window.addEventListener('resize', onWindowResize, false);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 3000, 0);

  controls.addEventListener('change', render);
}

//   function setupSkinsGUI() {
//     //var skinGui = gui.addFolder('Skins');

//     skinConfig = {
//       wireframe: false
//     };

//     var skinCallback = function(index) {
//       return function() {
//         character.setSkin(index);
//       };
//     };

//     for (var i = 0; i < character.numSkins; i++) {
//       var name = character.skins[i].name;
//       skinConfig[name] = skinCallback(i);
//     }

//     for (var i = 0; i < character.numSkins; i++) {
//       skinGui.add(skinConfig, character.skins[i].name);
//     }

//     skinGui.open();
//   }

function displayEx(arr, gooey) {
  for (var i = 0; i < arr.length; i++) {
    exerciseConfig[arr[i]] = function() {
      return null;
    };
    gooey.add(exerciseConfig, arr[i]);
  }
}

var pectorialEx = [
  'Bench Press',
  'Renegade Rows',
  'Push Ups',
  'Chest Press',
  'Cable Flyes',
  'Dips'
];
var abdominalEx = [
  'Crunches',
  'Plank',
  'Sit Ups',
  'Leg Raises',
  'Navy Kicks',
  'Russian Twists'
];
var calfEx = ['Calf Raises', 'Skater Jumps'];
var quadsEx = ['Sqauts', 'Step Ups', 'Lunges', 'Leg Extensions', 'Box Jumps'];
var bicepEx = [
  'Bicep Curls',
  'Hammer Curls',
  'Preacher Curls',
  'Zottoman Curls'
];
function setupGUI(intersectedObj) {
  if (gui) {
    gui.destroy();
    exerciseConfig = {
      wireframe: false
    };
  }
  gui = new dat.GUI();
  gui.width = 250;
  gui.open();
  var morphGui = gui.addFolder(intersectedObj.name + ' Exercises');

  //this doesn't work!

  exerciseConfig = {
    wireframe: false
  };

  if (intersectedObj.name === 'Pectorial') {
    displayEx(pectorialEx, morphGui);
  } else if (intersectedObj.name === 'Abdominal') {
    displayEx(abdominalEx, morphGui);
  } else if (intersectedObj.name === 'Gastrocnemius') {
    displayEx(calfEx, morphGui);
  } else if (intersectedObj.name === 'Quadriceps') {
    displayEx(quadsEx, morphGui);
  } else if (intersectedObj.name === 'Biceps') {
    displayEx(bicepEx, morphGui);
  }

  morphGui.open();
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

var raycaster = new THREE.Raycaster();

function onDocumentMouseDown(e) {
  e.preventDefault();

  var mouseVector = new THREE.Vector3(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouseVector.clone(), camera);

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    setupGUI(intersects[0].object);
  }
}

//circle - abs
var geometry = new THREE.PlaneBufferGeometry(350, 900, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0,
  transparent: true
});
var circle = new THREE.Mesh(geometry, material);
circle.position.set(0, 3600, 70);
circle.rotation.x -= 0.22;
circle.name = 'Abdominal';
scene.add(circle);

//circle - pecs
const planeGeometry = new THREE.PlaneBufferGeometry(500, 300, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0xf00000,
  opacity: 0,
  transparent: true
});
var square = new THREE.Mesh(planeGeometry, material);
square.position.set(0, 4350, -20);
square.rotation.x -= 0.4;
square.name = 'Pectorial';
scene.add(square);

//bone - calf
var boneGeo = new THREE.CylinderBufferGeometry(
  200,
  100,
  1000,
  500,
  1500,
  500,
  3000
);

var material = new THREE.MeshBasicMaterial({
  color: 0x0f0000,
  opacity: 0,
  transparent: true
});
var bone = new THREE.Mesh(boneGeo, material);
bone.position.set(300, 1000, -500);
bone.rotation.x += 0.2;
bone.name = 'Gastrocnemius';
scene.add(bone);

var boneGeo2 = new THREE.CylinderBufferGeometry(
  200,
  100,
  1000,
  500,
  1500,
  500,
  3000
);

var material = new THREE.MeshBasicMaterial({
  color: 0x0f0000,
  opacity: 0,
  transparent: true
});
var bone2 = new THREE.Mesh(boneGeo2, material);
bone2.position.set(-300, 1000, -500);
bone2.rotation.x += 0.2;
bone2.name = 'Gastrocnemius';
scene.add(bone2);

//planes - quads
const quadsGeometry = new THREE.PlaneBufferGeometry(270, 700, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0xf00000,
  opacity: 0,
  transparent: true
});
var quads = new THREE.Mesh(quadsGeometry, material);
quads.position.set(-250, 2050, -100);
quads.rotation.x += 0.2;
quads.name = 'Quadriceps';
scene.add(quads);

const quadsGeometry2 = new THREE.PlaneBufferGeometry(270, 700, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0xf00000,
  opacity: 0,
  transparent: true
});
var quads2 = new THREE.Mesh(quadsGeometry2, material);
quads2.position.set(250, 2050, -100);
quads2.rotation.x += 0.2;
quads2.name = 'Quadriceps';
scene.add(quads2);

//Biceps
const bicepGeometry = new THREE.PlaneBufferGeometry(400, 200, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0xf00000,
  opacity: 0,
  transparent: true
});
var bicep = new THREE.Mesh(bicepGeometry, material);
bicep.position.set(-950, 4300, -350);
bicep.rotation.x += 0.2;
bicep.name = 'Biceps';
scene.add(bicep);

const bicepGeometry2 = new THREE.PlaneBufferGeometry(400, 200, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0xf00000,
  opacity: 0,
  transparent: true
});
var bicep2 = new THREE.Mesh(bicepGeometry2, material);
bicep2.position.set(950, 4300, -350);
bicep2.rotation.x += 0.2;
bicep2.name = 'Biceps';
scene.add(bicep2);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();
}

function render() {
  var delta = 0.75 * clock.getDelta();

  // update skinning

  character.mixer.update(delta);

  renderer.render(scene, camera);
}

/*//turqoise cube
//initialize cube
var boxxy = new THREE.BoxGeometry(100, 100, 100);
//initialize mesh
var material = new THREE.MeshBasicMaterial({ color: 0x000000 });

//put them together
var cube = new THREE.Mesh(boxxy, material);

//set position
cube.position.set(0, 4000, 250);

//add to scene
scene.add(cube); */
