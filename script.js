var renderer = null,
    scene = null,
    camera = null,
    cube = null,
    animating = false;
$(document).ready(function () {
	/////////////////////////////////
	//   VARIABLES TO FUCK WITH
	////////////////////////////////
	
	
	var _noOfStars = 16000; //default 16000
	var _sizeOfUniverse = 1000; //default 1000, this is radius
	var _sizeOfStars = 0.2; //default 0.2 this is radius
	var _starColor = "ffffff" //default ffffff, this is a string containing a 24 bit hexadecimal number
	var _world = false; //no default, boolean to state wether you want the hench star in it at center
	
	  var fOV = 30;     //Field of View
    var aR = window.innerWidth / window.innerHeight;     //Aspect Ratio
    var nEAR = 0.1;    //Near
    var fAR = 3000;    //far   
    var camx = Math.floor((Math.random()*1.5*_sizeOfUniverse)-(0.75*_sizeOfUniverse))
    var camy = Math.floor((Math.random()*1.5*_sizeOfUniverse)-(0.75*_sizeOfUniverse))   
    var camz = Math.floor((Math.random()*1.5*_sizeOfUniverse)-(0.75*_sizeOfUniverse))
    alert("x: "+camx + "y: "+camy + "z: "+camz) 



	/////////////////////////////////
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^
	//    VARIABLES TO FUCK WITH
	////////////////////////////////
	
	
    //get canvas
    var container = document.getElementById("container");
    // create render and add to canvas
    renderer = new THREE.WebGLRenderer({antialias: true, canvas:container});
    //set size to window size
    renderer.setSize(window.innerWidth, window.innerHeight);
   
    
    // Create a new Three.js scene
    scene = new THREE.Scene();
    
    // Create a camera and add it to the scene
  
    camera = new THREE.PerspectiveCamera(  fOV ,                                          //Field of View
                                           aR,                                           //Aspect Ratio
                                           nEAR,                                          //Near
                                           fAR);                                          //Far
    camera.position.set((camx),(camy),(camz));
    scene.add(camera);
    
    // Frustum
     
    
    //NEED TO LOOK UP THIS RASCLART CODE
    
    //set up controls for the camera
    
    
        

    var control = new THREE.FirstPersonControls(camera);
    control.dragToLook = false;
    control.verticalMax = 3*Math.PI / 4;
    control.lookSpeed = 0.0001;
    control.movementSpeed = 0.03;

  
 /*
    var control = new THREE.FlyControls(camera);
    control.dragToLook = false;
    control.lookVertical = false
    control.lookSpeed = 0.00005;
    control.movementSpeed = 0.001;
    control.rollSpeed = 0.0005;
 */
    // create lights for the scene and add them
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,0,0);
    var light1 = new THREE.AmbientLight('0x'+_starColor);
    /*var light2 = new THREE.DirectionalLight(0xbada55);
    light2.position.set(0,10,-10).normalize();
    light2.rotation.x = Math.PI;*/
    scene.add(light);
   scene.add(light1);
    //scene.add(light2);
  
      // create a lambert mesh
      //var material = new THREE.MeshLambertMaterial({color: 0x366366});

      var texture = THREE.ImageUtils.loadTexture('moon.jpg');
      var material = new THREE.MeshBasicMaterial({map: texture});
    
    // create cube geometry
    var geometry = new THREE.SphereGeometry(_sizeOfStars,32,32);
  
    // set up transformation matrices
    var transMat = [   
	                   new THREE.Vector3(1,1,-1),
					   new THREE.Vector3(1,-1,1),
					   new THREE.Vector3(1,-1,-1),
					   new THREE.Vector3(-1,1,1),
					   new THREE.Vector3(-1,1,-1),
					   new THREE.Vector3(-1,-1,1),
					   new THREE.Vector3(-1,-1,-1),
					   new THREE.Vector3(1,1,1)
					];
	
    // create array for positions
	var positions = [];

    //add 500 random co-ordinates and their transformations to positions array 
    for(i=0;i<(_noOfStars/8);i++){
		var randomVector = new THREE.Vector3();
		randomVector.setX(Math.floor( Math.random() * (_sizeOfUniverse)));
        randomVector.setY(Math.floor( (Math.random() * Math.sqrt( ( (_sizeOfUniverse) * (_sizeOfUniverse) ) - (randomVector.x*randomVector.x) ) ) ) );
        randomVector.setZ(Math.floor( (Math.random() * Math.sqrt( ( (_sizeOfUniverse) * (_sizeOfUniverse) ) - (randomVector.x*randomVector.x) - (randomVector.y*randomVector.y) ) ) ) );
		for(j=0;j<transMat.length;j++){
			var position = new THREE.Vector3();
			position.multiply(randomVector,transMat[j]);
			positions.push(position);
		}

	};
    // add objects to the scene using positions array
    //Guessing this is where the code needs to go to check whether or not the object is within the frustum
    for(i=0;i<positions.length;i++){
        var object = new THREE.Mesh(geometry, material);
        object.position.set(positions[i].x,positions[i].y,positions[i].z);
		
        scene.add(object);
    };
	var wgeometry = new THREE.SphereGeometry(100,32,32);
    var world = new THREE.Mesh(wgeometry, material);
	if(_world){
		scene.add(world)
	}
	
	for(i=0;i<100;i++){
		console.log(scene.children[i]);
	}
    // Run our render loop
    run();
    
function run() {
    // update controls at 60fps
    control.update(1000/60);
	console.log(camera.position);
    //render scene and camera                  
    renderer.render (scene, camera);
    requestAnimationFrame(run);
}

});