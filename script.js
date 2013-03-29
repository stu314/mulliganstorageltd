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
        var fOV = 45;     //Field of View default 30
        var aR = window.innerWidth / window.innerHeight;     //Aspect Ratio
        var nEAR = 0.1;    //Near  - Default 0.2
        var fAR = 3000;    //far  - Default: 3000
        var camx = Math.floor((Math.random()*1.5*_sizeOfUniverse)-(0.75*_sizeOfUniverse)); //Starting position: X
        var camy = Math.floor((Math.random()*1.5*_sizeOfUniverse)-(0.75*_sizeOfUniverse)); //Starting position: Y  
        var camz = Math.floor((Math.random()*1.5*_sizeOfUniverse)-(0.75*_sizeOfUniverse)); //Starting position: Z
        alert("x: "+camx + "y: "+camy + "z: "+camz + "\n"+ _noOfStars + " stars");

        var _speed = 0.03; //Movement Speed, Default 0.3
var objects = [];
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
    
    
    //set up controls for the camera   

    var control = new THREE.FirstPersonControls(camera);
    control.dragToLook = false;
    control.verticalMax = 3*Math.PI / 4;
    control.lookSpeed = 0.0001;
    control.movementSpeed = _speed;

    //Variable Speed controls
        document.addEventListener('keydown', function(event) {
    if(event.keyCode == 49) {
        control.movementSpeed = 0.01;
    }
    else if(event.keyCode == 50) {
        control.movementSpeed = 0.03;
    }
    else if(event.keyCode == 51) {
        control.movementSpeed = 0.2;
    }
    else if(event.keyCode == 52) {
        control.movementSpeed = 0.4;
        alert('WARNING: HyperSpeed OverDrive Thrusters With BASE Engaged');
    }
});    
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
    
    for(i=0;i<positions.length;i++){
        var object = new THREE.Mesh(geometry, material);
        object.position.set(positions[i].x,positions[i].y,positions[i].z);
        
        scene.add(object);
        
        objects.push ( object );
        
        
    };
    
    
    
	var wgeometry = new THREE.SphereGeometry(100,32,32);
    var world = new THREE.Mesh(wgeometry, material);
	if(_world){
		scene.add(world)
	}
    
    
    
    //Below code makes stars clickable
    
    var projector = new THREE.Projector();
    
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    
    function onDocumentMouseDown( event ) {
            
    var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
                projector.unprojectVector( vector, camera );

                var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

                var intersects = ray.intersectObjects( objects );

                if ( intersects.length > 0 ) {
                        
                    
                    
                    var location = intersects[ 0 ].point;
                    
                    alert("Co-ordinates of this star\nX:="+location.x + "\nY:="+location.y + "\nZ:=" + location.z +"\nEGG I'M A RASCLART GENIUS\nThis actually displays the exact co-ordinate of where on the star you clicked, which is why you might get values with a range of 0.4 (star diameter) when clicking the same star multiple times.\nAlso, Bug: when you click OK, you are going to start moving, press W to stop");
                    //Instead of alert, here we should use location.x y and z to pull star info from the database: BOOOM WITH BASE RESPECT YOUR SHIT. 
                    

                }}
	
	
    // Run our render loop
    run();    
function run() {
    //render scene and camera                  
    renderer.render (scene, camera);
    requestAnimationFrame(run);
}
    // update controls at 60fps
    runControls();
    function runControls() {
        
        control.update(1000/60);
        setTimeout ( runControls , 1000 / 60 )
            
    }
        
    
});