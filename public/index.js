
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


  gui = new dat.GUI();
  gui.width = 300;
  gui.open();
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

function setupGUI(intersectedObj) {
  var morphGui = gui.addFolder(intersectedObj.name + ' Exercises');


  for (var i = 0; i < character.numMorphs; i++) {
    morphGui
      .add(null, 'Crunches');
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


  raycaster.setFromCamera(mouseVector.clone(),camera)

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = raycaster.intersectObjects( scene.children );
    console.log('intersects', intersects)
  if (intersects.length>0){
    console.log("Intersected object:", intersects.length);
    console.log(gui)
    if(!gui.__folders['Abs Exercises']) setupGUI(intersects[0].object)
    else console.log('this already exists')
}
}

//circle
var geometry = new THREE.CircleGeometry(100, 32);
var material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0.5,
  transparent: true
});
var circle = new THREE.Mesh(geometry, material);
circle.position.set(0, 3500, 70);
circle.rotation.x -= 0.22;
circle.name = 'Abs'
scene.add(circle);

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
