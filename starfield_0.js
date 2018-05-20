var camera, scene, renderer;
var mouseX = 0;
var mouseY = 0;
var particles = new Array();
var geometry;
var material;
var cube;
var animate;

var ORIGIN = new THREE.Vector3(0,0,0);
var MAXIMUM_THRESHOLD = 1000;
var MINIMUM_THRESHOLD = -1000;
var CAMERA_DISTANCE = 500;




function init(root) {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  root.appendChild( renderer.domElement );
  camera.position.z = CAMERA_DISTANCE;
  camera.lookAt(scene.position);

  buildForeground(scene);
  buildBackground(scene);
  initMouseEvents(scene);

  animate();
}

function buildForeground(scene) {
  geometry = new THREE.SphereGeometry( 100, 32, 32 );
  material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    shading: THREE.FlatShading
  });
  // material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  sphere = new THREE.Mesh( geometry, material );
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
 //This will add a starfield to the background of a scene
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

function onMouseMove(event) {
  var factor = 1000;
  mouseX = factor * ((event.clientX / window.innerWidth) - 0.5);
  mouseY = factor * ((event.clientY / window.innerHeight) - 0.5);
  // window.console.log(mouseX, mouseY);
}

animate = function () {
  requestAnimationFrame(animate);

  updateForeground(scene);
  updateBackground(scene);

  renderer.render(scene, camera);
};

init(document.body);