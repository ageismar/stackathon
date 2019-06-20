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

init();
animate();

function init() {
  container = document.getElementById('container');

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    100000
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
  character.onLoadComplete = function() {
    console.log('Load Complete');
    console.log(
      character.numSkins +
        ' skins and ' +
        character.numMorphs +
        ' morphtargets loaded.'
    );
    // gui = new dat.GUI();
    //setupSkinsGUI();
    //setupMorphsGUI();
    // gui.width = 300;
    //gui.open();
  };

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

function setupMorphsGUI() {
  var morphGui = gui.addFolder('Morphs');

  morphConfig = {};

  var morphCallback = function(index) {
    return function() {
      character.updateMorphs(morphConfig);
    };
  };

  for (var i = 0; i < character.numMorphs; i++) {
    var morphName = character.morphs[i];
    morphConfig[morphName] = 0;
  }

  for (var i = 0; i < character.numMorphs; i++) {
    morphGui
      .add(morphConfig, character.morphs[i])
      .min(0)
      .max(100)
      .onChange(morphCallback(i));
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
