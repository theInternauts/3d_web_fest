var camera, scene, renderer;
var mouseX = 0;
var mouseY = 0;
var particles = new Array();
var rings = new Array();
var waves = new Array();
var geometry;
var material;
var sphere;
var animate;
var planeMesh;
var cssObject;
var light1;
var light2;
var ambientLight;
var light1_color = 0xff1100;
var light2_color = 0x007ab9;
var ambientLight_color = 0x000000;

var ORIGIN = new THREE.Vector3(0,0,0);
var MAXIMUM_THRESHOLD = 1000;
var MINIMUM_THRESHOLD = -1000;
var CAMERA_DISTANCE = 500;


function ready(fn, args) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn.apply(this, args);
  } else {
    document.addEventListener('DOMContentLoaded', function(){
      fn.apply(this, args);
    });
  }
}

function buildGLRenderer() {
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x0c345c);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.zIndex = 1;
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  renderer.domElement.id = "C_GL";

  return renderer;
}

function buildCSSRenderer() {
  var renderer2 = new THREE.CSS3DRenderer();
  renderer2.setSize( window.innerWidth, window.innerHeight );

  renderer2.domElement.style.position = 'absolute';
  renderer2.domElement.style.zIndex = 0;
  renderer2.domElement.style.top = 0;
  renderer2.domElement.style.left = 0;
  renderer2.domElement.id = "C_CSS";

  return renderer2;
}

function buildCamera() {
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
  camera.position.z = CAMERA_DISTANCE;

  return camera;
}

function init(root) {
  window.console.log("yep", root);
  window.root = root;

  scene = new THREE.Scene();
  renderer = buildGLRenderer();

  scene2 = new THREE.Scene();
  renderer2 = buildCSSRenderer();

  // root.appendChild( renderer.domElement );
  // renderer.domElement.appendChild( renderer2.domElement );
  root.appendChild( renderer2.domElement );
  renderer2.domElement.appendChild( renderer.domElement );

  camera = buildCamera();
  camera.lookAt(scene.position);

  buildForeground(scene, scene2);
  buildBackground(scene);
  initWindowEvents(scene);
  initMouseEvents(scene);

  animate();
}

function buildForeground(scene, scene2) {
  buildForegroundGeometry(scene);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: false,
    flatShading: true
  });
  sphere = new THREE.Mesh( geometry, material );
  buildForegroundPanel(scene, scene2);
  buildForegroundLights(scene);
  scene.add( sphere );

  buildRings(scene);
}

function updateForeground(scene) {
  sphere.rotation.y += 0.002;
  // planeMesh.rotation.y = sphere.rotation;
  // planeMesh.rotation.y += 0.002;
  planeMesh.rotation.copy(sphere.rotation);
  // planeMesh.rotateY(0.002);
  cssObject.position.copy(planeMesh.position);
  cssObject.rotation.copy(planeMesh.rotation);

  updateCamera();
  updateForegroundGeometry();

}

function buildBackground(scene) {
  // buildPointStarfield(scene);
  buildSphericalStarfield(scene);
  ambientLight = new THREE.AmbientLight(ambientLight_color);
  scene.add(ambientLight);
}

function updateBackground(scene) {
  updateSphericalStarfield(scene);
}

function createPanel() {
  new_info = document.createElement( 'div' );
  new_info.id = "info";
  new_info.classList.add("info");

  var div1 = document.createElement( 'div' );
  div1.classList.add("title-block");
  div1.innerText = "3d Web Fest";
  var div2 = document.createElement( 'div' );
  div2.classList.add("tagline");
  div2.innerText = "The Shift is on";

  new_info.appendChild( div1 );
  new_info.appendChild( div2 );

  return new_info;
}

function buildForegroundPanel(scene1, scene2) {
  // create the plane mesh
  var material = new THREE.MeshBasicMaterial({
    wireframe: false,
    opacity: 0.0,
    side: THREE.DoubleSide
  });

  // material.color.set('yellow')
  // material.opacity   = 0.5;
  // material.blending  = THREE.NoBlending;

  var geometry = new THREE.PlaneGeometry(500,300);
  planeMesh = new THREE.Mesh( geometry, material );
  planeMesh.position.y -= 375;
  scene1.add(planeMesh);

  // create the dom Element
  // need to delay this call.  need all scripts to fire after DOM ready
  // element_i = document.getElementById('info');

  // create the object3d for this element
  var _p = createPanel();
  // var _p = document.getElementById('video-block');
  // _p.remove();
  cssObject = new THREE.CSS3DObject( _p );
  // we reference the same position and rotation
  cssObject.position.copy(planeMesh.position);
  cssObject.rotation.copy(planeMesh.rotation);
  // add it to the css scene
  scene2.add(cssObject);
}

function buildForegroundLights(scene) {
  /* Lighting */
  light1 = new THREE.PointLight( light1_color, 20, 2500 );
  // Cpoint(90,30)
  light1.position.set(975, 562.916512459885, 6.893739051711894e-14);
  light1.castShadow = true;

  // var lightSphere = new THREE.SphereGeometry( 50, 8, 8 );
  // light1_bloom = new THREE.DirectionalLight( light1_color, 1 );
  // light1_bloom.add( new THREE.Mesh(
  //     lightSphere,
  //     new THREE.MeshBasicMaterial({
  //       color: light1_color,
  //       opactiy: 0.1,
  //       transparent: true
  //     })
  //   )
  // );
  // Cpoint(90, 30, 1300)
  // light1_bloom.position.set(200, 200, 200);
  // light2 = new THREE.DirectionalLight( light2_color, 1 );
  light2 = new THREE.PointLight( light2_color, 5, 2500 );
  light2.castShadow = true;
  // Cpoint(-70,-10)
  light2.position.set(-1041.8645457690877, 183.70882966265955, 385.0575725438311);
  // light2.add( new THREE.Mesh( lightSphere, new THREE.MeshBasicMaterial( { color: light2_color } ) ) );

  // scene.add( light1_bloom );
  scene.add( light1 );
  scene.add( light2 );
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

function buildForegroundGeometry(scene) {
  geometry = new THREE.IcosahedronGeometry(100, 3);
  geometry.mergeVertices();

  // get the vertices
  var l = geometry.vertices.length;

  // create an array to store new data associated to each vertex
  // waves = [];

  for (var i=0; i<l; i++){
    // get each vertex
    var v = geometry.vertices[i];

    // store some data associated to it
    waves.push({y:v.y,
               x:v.x,
               z:v.z,
               // a random angle
               // ang:Math.random()*Math.PI*2,
               ang:0,
               // a random distance
               // amp:5 + Math.random()*15,
               amp:1.5,
               // a random speed between 0.016 and 0.048 radians / frame
               speed:0.016 + Math.random()*0.032
              });
  };
}

function updateForegroundGeometry() {
  // get the vertices
  var verts = sphere.geometry.vertices;
  var l = verts.length;

  for (var i=0; i<l; i++){
    var v = verts[i];

    // get the data associated to it
    var vprops = waves[i];

    // update the position of the vertex
    // v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
    // v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
    v.z = vprops.z + Math.sin(vprops.ang)*vprops.amp;
    // v.z = vprops.z + (Math.random()*vprops.amp - 0.5);

    // increment the angle for the next frame
    vprops.ang += vprops.speed;

  }

  // Tell the renderer that the geometry of the sphere has changed.
  // In fact, in order to maintain the best level of performance,
  // three.js caches the geometries and ignores any changes
  // unless we add this line
  sphere.geometry.verticesNeedUpdate=true;
}

function updateSphericalStarfield(scene) {
  var scalar_speed = 0.05;
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

function buildRings(scene) {
  var ring_thickness = 2;
  var base_radius = 120;
  var radius_set = [
    [base_radius, [0, 0.174533, 0]],
    [base_radius*1.8, [0.349066, 0, 0]],
    [base_radius*3.1, [-0.523599, 0.0872665, 0]],
    [base_radius*4.0, [-0.610865, 0, 0]],
    [base_radius*8, [-0.174533, 0, 0]]
  ];
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  var geometry, mesh;

  for(var i = 0; i < radius_set.length; i++) {
    mesh = new THREE.Mesh(
      new THREE.RingGeometry(
        radius_set[i][0],
        radius_set[i][0] - calcThickness(ring_thickness, i),
        32
      ),
      material
    );
    mesh.rotation.x = radius_set[i][1][0];
    mesh.rotation.y = radius_set[i][1][1];
    mesh.rotation.z = radius_set[i][1][2];
    rings.push(mesh);
    scene.add(mesh);
  }
}

function calcThickness(base_factor, index) {
  if (index > 1) {
    return base_factor * Math.log(index) + 1;
  } else {
    return 1;
  }
}

function updateCamera() {
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
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer2.setSize(window.innerWidth, window.innerHeight);
}

function Cpoint(inc, azi, radius){
  // util for debgging
  if(radius == null || radius === undefined){
    var radius = Math.sqrt((650*650)*3)
  }
  function toR(deg){ return (deg*Math.PI)/180};

  return [radius*Math.sin(toR(inc))*Math.cos(toR(azi)), radius*Math.sin(toR(inc))*Math.sin(toR(azi)), radius*Math.cos(toR(inc))];
}

animate = function () {

  updateForeground(scene);
  updateBackground(scene);

  renderer2.render(scene2, camera);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
};

ready(init, [document.body]);