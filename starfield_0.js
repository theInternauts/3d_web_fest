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
var CAMERA_DISTANCE = 500;




function init(root) {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );

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

  // buildPointStarfield(scene);
  buildSphericalStarfield(scene);
  ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);
}

function updateBackground(scene) {
  updateSphericalStarfield(scene);
}

function buildPointStarfield(scene) {
  var particle, material, particleMesh, geometry;
  geometry = new THREE.Geometry();
  material = new THREE.PointsMaterial({color: 0xffffff});

  var h_width = window.innerWidth/2;
  var h_height = window.innerHeight/2;
  var depth = MAXIMUM_THRESHOLD - MINIMUM_THRESHOLD;

  for(var i = MINIMUM_THRESHOLD; i < MAXIMUM_THRESHOLD; i++) {
    particle = new THREE.Vector3();

    particle.x = Math.random() * window.innerWidth - h_width;
    particle.y = Math.random() * window.innerHeight - h_height;
    particle.z = Math.random() * depth - (depth/2);

    geometry.vertices.push(particle);
    particles.push(particle);

  }
  particleMesh = new THREE.Points( geometry, material );
  scene.add(particleMesh);
}

function buildSphericalStarfield(scene) {
  var particle, material, particleMesh, geometry;
  geometry = new THREE.SphereGeometry(1, 8, 8);
  material = new THREE.MeshBasicMaterial({color: 0xffffff});

  var h_width = window.innerWidth/2;
  var h_height = window.innerHeight/2;
  var depth = MAXIMUM_THRESHOLD - MINIMUM_THRESHOLD;

  for(var i = MINIMUM_THRESHOLD; i < MAXIMUM_THRESHOLD; i++) {
    particle = new THREE.Mesh( geometry, material );

    particle.scale.x = particle.scale.y = particle.scale.z = Math.random() * 1.2;

    particle.position.x = Math.random() * window.innerWidth - h_width;
    particle.position.y = Math.random() * window.innerHeight - h_height;
    particle.position.z = Math.random() * depth - (depth/2);

    particles.push(particle);
    scene.add(particle);
  }
}

function updateSphericalStarfield(scene) {
  var scalar_speed = 1;
  particles.forEach(function(p){
    if(p.position.z > MAXIMUM_THRESHOLD) {
      p.position.z = MINIMUM_THRESHOLD;
    } else if(p.position.z < MINIMUM_THRESHOLD) {
      p.position.z = MAXIMUM_THRESHOLD;
    } else {
      p.position.z += scalar_speed;
    }
  });
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