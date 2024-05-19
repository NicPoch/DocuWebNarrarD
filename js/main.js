import * as THREE from 'three';

const LENGTH=45;
const WIDTH=45;
const INIT_POSITION_Z=5;
const LIMIT_TRANSLATE_X=18;
const LIMIT_TRANSLATE_Z=18;
const LIMIT_ROTATION_X=1;
const Y_OFFSET=5;
const SPEED = 0.1;
const ROTATION_SPEED = 0.1;
const FIX_Y=0;

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const camera = new THREE.PerspectiveCamera(
    75,//field of view
    window.innerWidth/window.innerHeight, //aspect ratio
    1,//near
    1000
);

scene.add(camera);
camera.position.z=INIT_POSITION_Z;//initial place of camera 5 units behind

//Render
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0xffffff,1);
document.body.appendChild(renderer.domElement);


//lights
//Ambient light
let ambientLight = new THREE.AmbientLight(0x101010,1);
ambientLight.lookAt(camera.position);//light in position of camera
scene.add(ambientLight);
//Directional Light
let sunLight=new THREE.DirectionalLight(0x101010,1);
sunLight.lookAt(0,15,0);
scene.add(sunLight);

//geometries

const createPlaneGeometry=(width,length,imagePath)=>{
    let geometry = new THREE.PlaneGeometry(width,length);
    let texture = textureLoader.load(imagePath);
    let material = new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
    let mesh = new THREE.Mesh(geometry,material);
    return mesh
};

const cubeGeometry=new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color:'blue'});
const cubeMesh = new THREE.Mesh(cubeGeometry,cubeMaterial);
scene.add(cubeMesh);

//Create floor
const floorMesh=createPlaneGeometry(WIDTH,LENGTH,'images/piso.jpeg');
floorMesh.rotateX(Math.PI/2);
floorMesh.rotateY(-Math.PI);
floorMesh.position.setY(-Y_OFFSET);
console.log("floorMesh");
console.log(floorMesh.position);
console.log(floorMesh.rotation);
scene.add(floorMesh);

//create walls
const wallGroup= new THREE.Group();
scene.add(wallGroup);
//front wall
const frontWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgFront.jpg');
frontWallMesh.translateZ(-WIDTH/2);
frontWallMesh.translateY((LENGTH/2)-Y_OFFSET);
console.log("frontWallMesh");
console.log(frontWallMesh.position);
console.log(frontWallMesh.rotation);
wallGroup.add(frontWallMesh);
//back wall
const backWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgBack.jpeg');
backWallMesh.translateZ(WIDTH/2);
backWallMesh.translateY((LENGTH/2)-Y_OFFSET);
console.log("backWallMesh");
console.log(backWallMesh.position);
console.log(backWallMesh.rotation);
wallGroup.add(backWallMesh);
//left wall
const leftWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgLeft.jpeg');
leftWallMesh.rotateY(Math.PI/2);
leftWallMesh.translateZ(LENGTH/2);
leftWallMesh.translateY((WIDTH/2)-Y_OFFSET);
console.log("leftWallMesh");
console.log(leftWallMesh.position);
console.log(leftWallMesh.rotation);
wallGroup.add(leftWallMesh);
//right wall
const rightWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgRight.jpeg');
rightWallMesh.rotateY(Math.PI/2);
rightWallMesh.translateZ(-LENGTH/2);
rightWallMesh.translateY((WIDTH/2)-Y_OFFSET);
console.log("rightWallMesh");
console.log(rightWallMesh.position);
console.log(rightWallMesh.rotation);
wallGroup.add(rightWallMesh);

//Ceiling
const ceilingMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgCeiling.jpg');
ceilingMesh.rotateX(Math.PI/2);
ceilingMesh.rotateY(-Math.PI);
ceilingMesh.position.setY(LENGTH-Y_OFFSET);
console.log("ceilingMesh");
console.log(ceilingMesh.position);
console.log(ceilingMesh.rotation);
scene.add(ceilingMesh);

//Images story
const poster1Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/poster1.jpg');
poster1Mesh.rotateY(Math.PI/2);
poster1Mesh.translateZ((-LENGTH/2)+1);
poster1Mesh.translateX(-WIDTH/5);
poster1Mesh.translateY(Y_OFFSET);
console.log("poster1Mesh");
console.log(poster1Mesh.position);
console.log(poster1Mesh.rotation);
scene.add(poster1Mesh);

const poster2Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/poster2.jpg');
poster2Mesh.rotateY(Math.PI/2);
poster2Mesh.translateZ((-LENGTH/2)+1);
poster2Mesh.translateX(WIDTH/5);
poster2Mesh.translateY(Y_OFFSET);
console.log("poster2Mesh");
console.log(poster2Mesh.position);
console.log(poster2Mesh.rotation);
scene.add(poster2Mesh);

//Controls

document.addEventListener('keydown', (event) => {
    //Z:(-18,18)
    //X:(-18,18)
    //X_theta : (-1,1)
    switch (event.code) {
        case "KeyW":
            //look up
            camera.rotateOnAxis(new THREE.Vector3(1,0,0),Math.abs(camera.rotation.x)< LIMIT_ROTATION_X ? ROTATION_SPEED: -ROTATION_SPEED);
            break;
        case "KeyS":
            //look down
            camera.rotateOnAxis(new THREE.Vector3(1,0,0),Math.abs(camera.rotation.x)< LIMIT_ROTATION_X ? -ROTATION_SPEED: ROTATION_SPEED);
            break;
        case 'KeyD':
            // Rotate camera to the right
            camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-ROTATION_SPEED);
            break;
        case 'KeyA':
            // Rotate camera to the left
            camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0),ROTATION_SPEED);
            break;
        case 'ArrowUp':
            // Move forward in the direction the camera is facing
            camera.translateZ(Math.abs(camera.position.z)<LIMIT_TRANSLATE_Z ? -SPEED*Math.cos(camera.position.y):  SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            break;
        case 'ArrowDown':
            // Move backward in the opposite direction the camera is facing
            camera.translateZ(Math.abs(camera.position.z)<LIMIT_TRANSLATE_Z ? SPEED*Math.cos(camera.position.y): -SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            break;
        case 'ArrowRight':
            // Move forward in the direction the camera is facing
            camera.translateX(Math.abs(camera.position.x)<LIMIT_TRANSLATE_X ? SPEED*Math.cos(camera.position.y): - SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            break;
        case 'ArrowLeft':
            // Move backward in the opposite direction the camera is facing
            camera.translateX(Math.abs(camera.position.x)<LIMIT_TRANSLATE_X ? -SPEED: SPEED);
            camera.position.setY(FIX_Y);
            break;
        case "KeyR":
            //Reset position
            camera.position.setX(0);
            camera.position.setZ(INIT_POSITION_Z);
            camera.rotation.set(0,0,0);
            break;
    }
});


//Render
let animationLoop=function(){
    cubeMesh.rotateX(0.03);
    cubeMesh.rotateZ(0.02);
    cubeMesh.rotateY(0.01);
    renderer.render(scene,camera);
    requestAnimationFrame(animationLoop);
};

animationLoop();