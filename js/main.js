import * as THREE from 'three';

//Z:(-18,18)
//X:(-18,18)
//X_theta : (-1,1)

const LENGTH=80;
const WIDTH=80;
const INIT_POSITION_Z=5;
const LIMIT_ROTATION_X=1;
const Y_OFFSET=5;
const SPEED = 0.1;
const ROTATION_SPEED = 0.1;
const FIX_Y=0;

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
//create wallgroup
const wallGroup= new THREE.Group();
scene.add(wallGroup);
//create poster group
const posterGroup= new THREE.Group();
scene.add(posterGroup);


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

const createPlaneGeometryWithRepeatingTexture=(width,length,imagePath)=>{
    let geometry = new THREE.PlaneGeometry(width,length);
    let texture = textureLoader.load(imagePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(WIDTH/10,LENGTH/10);
    let material = new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
    let mesh = new THREE.Mesh(geometry,material);
    return mesh
};

const cubeGeometry=new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color:'blue'});
const cubeMesh = new THREE.Mesh(cubeGeometry,cubeMaterial);
scene.add(cubeMesh);

//Create floor
const floorMesh=createPlaneGeometryWithRepeatingTexture(WIDTH,LENGTH,'images/piso.jpeg');
floorMesh.rotateX(Math.PI/2);
floorMesh.rotateY(-Math.PI);
floorMesh.position.setY(-Y_OFFSET);
console.log("floorMesh");
console.log(floorMesh.position);
console.log(floorMesh.rotation);
scene.add(floorMesh);

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
//collisions on wall
wallGroup.children.forEach((w)=>{
    w.BoundingBox=new THREE.Box3();
    w.BoundingBox.setFromObject(w);
});

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
poster1Mesh.rotateY(-Math.PI/2);
poster1Mesh.translateZ((-LENGTH/2)+1);
poster1Mesh.translateY(Y_OFFSET);
console.log("poster1Mesh");
console.log(poster1Mesh.position);
console.log(poster1Mesh.rotation);
posterGroup.add(poster1Mesh);

const poster2Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/poster2.jpg');
poster2Mesh.rotateY(Math.PI/2);
poster2Mesh.translateZ((-LENGTH/2)+1);
poster2Mesh.translateY(Y_OFFSET);
console.log("poster2Mesh");
console.log(poster2Mesh.position);
console.log(poster2Mesh.rotation);
posterGroup.add(poster2Mesh);

const poster3Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/poster1.jpg');
poster3Mesh.translateZ((-LENGTH/2)+1);
poster3Mesh.translateY(Y_OFFSET);
console.log("poster3Mesh");
console.log(poster3Mesh.position);
console.log(poster3Mesh.rotation);
posterGroup.add(poster3Mesh);

const poster4Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/poster2.jpg');
poster4Mesh.translateZ((LENGTH/2)-1);
poster4Mesh.translateY(Y_OFFSET);
console.log("poster4Mesh");
console.log(poster4Mesh.position);
console.log(poster4Mesh.rotation);
posterGroup.add(poster4Mesh);

//Controls

//Check collisions

const checkCollision=()=>{
    const playerBoundingBox=new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(3,3,3)
    )
    for (let index = 0; index < wallGroup.children.length; index++) {
        const wall = wallGroup.children[index];
        if(playerBoundingBox.intersectsBox(wall.BoundingBox)){
            return true;
        }
    }
    return false;
};
document.addEventListener('keydown', (event) => {
    console.log(event.code);
    //block Movement
    const isOnMenu=document.getElementById('menu').style.display==='block';
    switch (event.code) {
        case "KeyW":
            //look up
            if(!isOnMenu){
                camera.rotateOnAxis(new THREE.Vector3(1,0,0),Math.abs(camera.rotation.x)< LIMIT_ROTATION_X ? ROTATION_SPEED: -ROTATION_SPEED);
            }
            break;
        case "KeyS":
            //look down
            if(!isOnMenu){
            camera.rotateOnAxis(new THREE.Vector3(1,0,0),Math.abs(camera.rotation.x)< LIMIT_ROTATION_X ? -ROTATION_SPEED: ROTATION_SPEED);}
            break;
        case 'KeyD':
            // Rotate camera to the right
            if(!isOnMenu){
            camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-ROTATION_SPEED);
            }
            break;
        case 'KeyA':
            // Rotate camera to the left
            if(!isOnMenu){
            camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0),ROTATION_SPEED);
            }
            break;
        case 'ArrowUp':
            // Move forward in the direction the camera is facing
            if(!isOnMenu){
            camera.translateZ(!checkCollision() ? -SPEED*Math.cos(camera.position.y):  SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            }
            break;
        case 'ArrowDown':
            // Move backward in the opposite direction the camera is facing
            if(!isOnMenu){
            camera.translateZ(!checkCollision() ? SPEED*Math.cos(camera.position.y): -SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            }
            break;
        case 'ArrowRight':
            // Move forward in the direction the camera is facing
            if(!isOnMenu){
            camera.translateX(!checkCollision() ? SPEED*Math.cos(camera.position.y): - SPEED);
            camera.position.setY(FIX_Y);
            }
            break;
        case 'ArrowLeft':
            // Move backward in the opposite direction the camera is facing
            if(!isOnMenu){
            camera.translateX(!checkCollision() ? -SPEED: SPEED);
            camera.position.setY(FIX_Y);
            }
            break;
        case "KeyR":
            //Reset position
            camera.position.setX(0);
            camera.position.setZ(INIT_POSITION_Z);
            camera.rotation.set(0,0,0);
            break;
        case "KeyI":
            console.log("Position:");
            console.log(camera.position);
            console.log("Rotation:")
            console.log(camera.rotation);
            break;
        case "Enter":
            document.getElementById('menu').style.display='none';
            break;
        case "KeyM":
            document.getElementById('menu').style.display='block';
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