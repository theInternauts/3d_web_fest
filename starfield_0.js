var camera, scene, renderer;
var mouseX = 0;
var mouseY = 0;
var particles = new Array();
var geometry;
var material;
var sphere;
var animate;
var light1;
var light2;
var ambientLight;

var ORIGIN = new THREE.Vector3(0,0,0);
var MAXIMUM_THRESHOLD = 1000;
var MINIMUM_THRESHOLD = -1000;
var CAMERA_DISTANCE = 200;




function init(root) {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  root.appendChild( renderer.domElement );
  camera.position.z = CAMERA_DISTANCE;
  camera.lookAt(scene.position);

  buildForeground(scene);
  buildBackground(scene);
  initWindowEvents(scene);
  initMouseEvents(scene);

  animate();
}

function buildForeground(scene) {
  geometry = new THREE.SphereGeometry( 100, 32, 32 );
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: false,
    flatShading: true
  });
  // shading: THREE.FlatShading
  // material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  sphere = new THREE.Mesh( geometry, material );

  /* Lighting */
  var lightSphere = new THREE.SphereGeometry( 10, 8, 8 );
  light1 = new THREE.DirectionalLight( 0xff0040, 1 );
  light1.castShadow = true;
  light1.position.set( 300, 300, 300 );
  light1.add( new THREE.Mesh( lightSphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  light2 = new THREE.DirectionalLight( 0x0040ff, 1 );
  light2.castShadow = true;
  light2.position.set( -300, -300, -300 );
  light2.add( new THREE.Mesh( lightSphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );

  scene.add( light1 );
  scene.add( light2 );
  scene.add( sphere );
}

function updateForeground(scene) {
  sphere.rotation.y += 0.002;
  updateCamera(scene);

}

function buildBackground(scene) {
  // var particle, material;
  // var PI2 = Math.PI * 2;
  // for(var i = MINIMUM_THRESHOLD; i < MINIMUM_THRESHOLD; i+=20) {
  //   material = new THREE.SpriteCanvasMaterial({
  //     color: 0xffffff,
  //     program: function ( context ) {
  //       context.beginPath();
  //       context.arc( 0, 0, 0.5, 0, PI2, true );
  //       context.fill();
  //     }
  //   });
  //   particle = new THREE.Sprite(material);

  //   particle.position.x = Math.Random()*window.innerWidth - window.innerWidth/2
  //   particle.position.y = Math.Random()*window.innerHeight - window.innerHeight/2
  //   particle.position.z = i;

  //   particle.scale.x = particle.scale.y = 10;

  //   scene.add(particle);
  //   particles.push(particle);
  // }
  ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);
  scene.background = new THREE.Color( 0x0c345c );
  // This will add a starfield to the background of a scene
  var starsGeometry = new THREE.Geometry();

  for ( var i = 0; i < 10000; i ++ ) {
    var star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread( 2000 );
    star.y = THREE.Math.randFloatSpread( 2000 );
    star.z = THREE.Math.randFloatSpread( 2000 );

    starsGeometry.vertices.push( star );
  }

  var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
  var starField = new THREE.Points( starsGeometry, starsMaterial );

  scene.add( starField );
}

function updateBackground(scene) {

}

function updateCamera(scene) {
  camera.position.x = mouseX;
  camera.position.y = mouseY;
  camera.position.z = CAMERA_DISTANCE;
  camera.lookAt(ORIGIN);
}

function initMouseEvents(scene) {
  document.addEventListener( 'mousemove', onMouseMove, false );
}

function initWindowEvents(scene){
  window.addEventListener('resize', onWindowResize, false);
}

function onMouseMove(event) {
  var factor = 1000;
  mouseX = factor * ((event.clientX / window.innerWidth) - 0.5);
  mouseY = factor * ((event.clientY / window.innerHeight) - 0.5);
  // window.console.log(mouseX, mouseY);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

animate = function () {
  requestAnimationFrame(animate);

  updateForeground(scene);
  updateBackground(scene);

  renderer.render(scene, camera);
};

init(document.body);