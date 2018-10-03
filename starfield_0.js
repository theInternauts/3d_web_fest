

function ready(fn, args) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn.apply(this, args);
  } else {
    document.addEventListener('DOMContentLoaded', function(){
      fn.apply(this, args);
    });
  }
}

function start(root) {
  window.app = new App(root);
}

function App(root) {
  this.CONSTANTS = {
    ORIGIN: new THREE.Vector3(0,0,0),
    MAXIMUM_THRESHOLD: 1000,
    MINIMUM_THRESHOLD: -1000,
    CAMERA_DISTANCE: 500
  }
  this.root = root;


  window.console.log("yep", this.root);
  window.root = this.root;

  this.init();
  this.animate();
};

App.prototype.init = function() {
  this.camera;
  this.mouseX = 0;
  this.mouseY = 0;
  // this.geometry;
  // this.material;
  // this.sphere;
  // this.animate;
  // this.planeMesh;
  // this.cssObject;
  this.light1;
  this.light2;
  // this.ambientLight;
  this.light1_color = 0xff1100;
  this.light2_color = 0x007ab9;
  this.ambientLight_color = 0x000000;

  this.scene_GL = new THREE.Scene();
  this.renderer_GL = this.buildGLRenderer();

  this.scene_CSS3D = new THREE.Scene();
  this.renderer_CSS3D = this.buildCSSRenderer();

  this.foreground = new Foreground(this.scene_GL, this.scene_CSS3D);
  this.background = new Background(this.scene_GL, this.scene_CSS3D);

  this.root.appendChild( this.renderer_CSS3D.domElement );
  this.renderer_CSS3D.domElement.appendChild( this.renderer_GL.domElement );

  this.camera = this.buildCamera();
  this.camera.lookAt(this.scene_GL.position);

  this.buildForeground(this.foreground);
  this.buildBackground(this.background);
  this.initWindowEvents(this.scene_GL);
  this.initMouseEvents(this.scene_GL);
};
App.prototype.buildGLRenderer = function() {
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer.setClearColor(0x0c345c);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.zIndex = 1;
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  renderer.domElement.id = "C_GL";

  return renderer;
}

App.prototype.buildCSSRenderer = function() {
  var renderer_CSS3D = new THREE.CSS3DRenderer();
  renderer_CSS3D.setSize( window.innerWidth, window.innerHeight );

  renderer_CSS3D.domElement.style.position = 'absolute';
  renderer_CSS3D.domElement.style.zIndex = 0;
  renderer_CSS3D.domElement.style.top = 0;
  renderer_CSS3D.domElement.style.left = 0;
  renderer_CSS3D.domElement.id = "C_CSS";

  return renderer_CSS3D;
}

App.prototype.buildCamera = function() {
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
  camera.position.z = this.CONSTANTS.CAMERA_DISTANCE;

  return camera;
}

App.prototype.buildForeground = function(foreground) {
  foreground.geometry = this.buildForegroundGeometry(foreground);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: false,
    flatShading: true
  });
  foreground.sphere = new THREE.Mesh( foreground.geometry, material );
  this.buildForegroundPanel(foreground);
  this.buildForegroundLights(foreground);
  foreground.scene_GL.add( foreground.sphere );

  this.buildRings(foreground);
}

App.prototype.updateForeground = function(foreground) {
  foreground.sphere.rotation.y += 0.002;

  this.updateForegroundGeometry(foreground);
}

App.prototype.buildBackground = function(background) {
  // this.buildPointStarfield(background);
  this.buildSphericalStarfield(background);
  var ambientLight = new THREE.AmbientLight(this.ambientLight_color);
  background.scene_GL.add(ambientLight);
}

App.prototype.updateBackground = function(background) {
  this.updateSphericalStarfield(background);
}

App.prototype.createPanel = function() {
  var new_info = document.createElement( 'div' );
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

App.prototype.buildForegroundPanel = function(foreground) {
  // create the plane mesh
  var material = new THREE.MeshBasicMaterial({
    wireframe: false,
    opacity: 0.0,
    color: 0x00
  });

  // material.color.set('0c345c')
  // material.opacity   = 0.5;
  // material.blending  = THREE.NoBlending;

  var geometry = new THREE.PlaneGeometry(220, 125);
  var planeMesh = new THREE.Mesh( geometry, material );
  planeMesh.position.y -= 200;
  foreground.scene_GL.add(planeMesh);

  // create the dom Element
  // need to delay this call.  need all scripts to fire after DOM ready
  // element_i = document.getElementById('info');

  // create the object3d for this element
  var _p = this.createPanel();
  // var _p = document.getElementById('video-block');
  // _p.remove();
  var cssObject = new THREE.CSS3DObject( _p );
  // we reference the same position and rotation
  cssObject.position.copy(planeMesh.position);
  // cssObject.rotation.copy(planeMesh.rotation);
  // add it to the css scene
  foreground.scene_CSS3D.add(cssObject);
}

App.prototype.buildForegroundLights = function(foreground) {
  /* Lighting */
  this.light1 = new THREE.PointLight( this.light1_color, 20, 2500 );
  // this.Cpoint(90,30)
  this.light1.position.set(975, 562.916512459885, 6.893739051711894e-14);
  this.light1.castShadow = true;

  // var lightSphere = new THREE.SphereGeometry( 50, 8, 8 );
  // this.light1_bloom = new THREE.DirectionalLight( this.light1_color, 1 );
  // this.light1_bloom.add( new THREE.Mesh(
  //     lightSphere,
  //     new THREE.MeshBasicMaterial({
  //       color: this.light1_color,
  //       opactiy: 0.1,
  //       transparent: true
  //     })
  //   )
  // );
  // this.Cpoint(90, 30, 1300)
  // this.light1_bloom.position.set(200, 200, 200);
  // this.light2 = new THREE.DirectionalLight( this.light2_color, 1 );
  this.light2 = new THREE.PointLight( this.light2_color, 5, 2500 );
  this.light2.castShadow = true;
  // this.Cpoint(-70,-10)
  this.light2.position.set(-1041.8645457690877, 183.70882966265955, 385.0575725438311);
  // this.light2.add( new THREE.Mesh( lightSphere, new THREE.MeshBasicMaterial( { color: this.light2_color } ) ) );

  // foreground.scene_GL.add( this.light1_bloom );
  foreground.scene_GL.add( this.light1 );
  foreground.scene_GL.add( this.light2 );
}

App.prototype.buildPointStarfield = function(background) {
  var particle, material, particleMesh, geometry;
  geometry = new THREE.Geometry();
  material = new THREE.PointsMaterial({color: 0xffffff});

  var h_width = window.innerWidth/2;
  var h_height = window.innerHeight/2;
  var depth = this.CONSTANTS.MAXIMUM_THRESHOLD - this.CONSTANTS.MINIMUM_THRESHOLD;

  for(var i = this.CONSTANTS.MINIMUM_THRESHOLD; i < this.CONSTANTS.MAXIMUM_THRESHOLD; i++) {
    particle = new THREE.Vector3();

    particle.x = Math.random() * window.innerWidth - h_width;
    particle.y = Math.random() * window.innerHeight - h_height;
    particle.z = Math.random() * depth - (depth/2);

    geometry.vertices.push(particle);
    background.particles.push(particle);

  }
  particleMesh = new THREE.Points( geometry, material );
  background.scene_GL.add(particleMesh);
}

App.prototype.buildSphericalStarfield = function(background) {
  var particle, material, particleMesh, geometry;
  geometry = new THREE.SphereGeometry(1, 8, 8);
  material = new THREE.MeshBasicMaterial({color: 0xffffff});

  var h_width = window.innerWidth/2;
  var h_height = window.innerHeight/2;
  var depth = this.CONSTANTS.MAXIMUM_THRESHOLD - this.CONSTANTS.MINIMUM_THRESHOLD;

  for(var i = this.CONSTANTS.MINIMUM_THRESHOLD; i < this.CONSTANTS.MAXIMUM_THRESHOLD; i++) {
    particle = new THREE.Mesh( geometry, material );

    particle.scale.x = particle.scale.y = particle.scale.z = Math.random() * 1.2;

    particle.position.x = Math.random() * window.innerWidth - h_width;
    particle.position.y = Math.random() * window.innerHeight - h_height;
    particle.position.z = Math.random() * depth - (depth/2);

    background.particles.push(particle);
    background.scene_GL.add(particle);
  }
}

App.prototype.buildForegroundGeometry = function(foreground) {
  var geometry = new THREE.IcosahedronGeometry(100, 3);
  geometry.mergeVertices();

  // get the vertices
  var l = geometry.vertices.length;

  // create an array to store new data associated to each vertex
  foreground.waves = [];

  for (var i=0; i<l; i++){
    // get each vertex
    var v = geometry.vertices[i];

    // store some data associated to it
    foreground.waves.push({y:v.y,
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

  return geometry;
}

App.prototype.updateForegroundGeometry = function(foreground) {
  // get the vertices
  var verts = foreground.sphere.geometry.vertices;
  var l = verts.length;

  for (var i=0; i<l; i++){
    var v = verts[i];

    // get the data associated to it
    var vprops = foreground.waves[i];
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
  foreground.sphere.geometry.verticesNeedUpdate=true;
}

App.prototype.updateSphericalStarfield = function(background) {
  var scalar_speed = 0.05;
  background.particles.forEach(function(p){
    if(p.position.z > this.CONSTANTS.MAXIMUM_THRESHOLD) {
      p.position.z = this.CONSTANTS.MINIMUM_THRESHOLD;
    } else if(p.position.z < this.CONSTANTS.MINIMUM_THRESHOLD) {
      p.position.z = this.CONSTANTS.MAXIMUM_THRESHOLD;
    } else {
      p.position.z += scalar_speed;
    }
  }.bind(this));
}

App.prototype.buildRings = function(foreground) {
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
        radius_set[i][0] - this.calcThickness(ring_thickness, i),
        32
      ),
      material
    );
    mesh.rotation.x = radius_set[i][1][0];
    mesh.rotation.y = radius_set[i][1][1];
    mesh.rotation.z = radius_set[i][1][2];
    foreground.rings.push(mesh);
    foreground.scene_GL.add(mesh);
  }
}

App.prototype.calcThickness = function(base_factor, index) {
  if (index > 1) {
    return base_factor * Math.log(index) + 1;
  } else {
    return 1;
  }
}

App.prototype.updateCamera = function() {
  this.camera.position.x = this.mouseX;
  this.camera.position.y = this.mouseY;
  this.camera.position.z = this.CONSTANTS.CAMERA_DISTANCE;
  this.camera.lookAt(this.CONSTANTS.ORIGIN);
}

App.prototype.initMouseEvents = function(scene_GL) {
  document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
}

App.prototype.initWindowEvents = function(scene_GL){
  window.addEventListener('resize', this.onWindowResize.bind(this), false);
}

App.prototype.onMouseMove = function(event_GL) {
  var factor = 1000;
  this.mouseX = factor * ((event_GL.clientX / window.innerWidth) - 0.5);
  this.mouseY = factor * ((event_GL.clientY / window.innerHeight) - 0.5);
  // window.console.log(this.mouseX, this.mouseY);
}

App.prototype.onWindowResize = function() {
  this.renderer_GL.setPixelRatio(window.devicePixelRatio);
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer_CSS3D.setSize(window.innerWidth, window.innerHeight);
}

App.prototype.Cpoint = function(inc, azi, radius){
  // util for debgging
  if(radius == null || radius === undefined){
    var radius = Math.sqrt((650*650)*3)
  }
  function toR(deg){ return (deg*Math.PI)/180};

  return [radius*Math.sin(toR(inc))*Math.cos(toR(azi)), radius*Math.sin(toR(inc))*Math.sin(toR(azi)), radius*Math.cos(toR(inc))];
}

App.prototype.animate = function () {

  this.updateForeground(this.foreground);
  this.updateBackground(this.background);
  this.updateCamera();

  this.renderer_CSS3D.render(this.scene_CSS3D, this.camera);
  this.renderer_GL.render(this.scene_GL, this.camera);

  requestAnimationFrame(this.animate.bind(this));
};

function Foreground(scene_GL, scene_CSS3D){
  this.scene_GL = scene_GL;
  this.scene_CSS3D = scene_CSS3D;
  this.waves = new Array();
  this.sphere;
  this.rings = new Array();
}
function Background(scene_GL, scene_CSS3D){
  this.scene_GL = scene_GL;
  this.scene_CSS3D = scene_CSS3D;
  this.particles = new Array();
}

ready(start, [document.body]);