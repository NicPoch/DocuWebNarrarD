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
//create video group
const videoGroup= new THREE.Group();
scene.add(videoGroup);
//HTML
const helpMenu=document.getElementById('info-content');
const menu=document.getElementById('menu');
const videoLibrerosUnidos=document.getElementById('libreros-unidos');
const videoHistoriasEntrelazadas=document.getElementById('historias-entrelazadas');
//text per resource
const libreria={
    "titulo":"titulo libreria",
    "personas":"personas libreria",
    "texto":"texto libreria"
};
const historiasEntrelazadas={
    "titulo":"titulo historiasEntrelazadas",
    "personas":"personas historiasEntrelazadas",
    "texto":"texto historiasEntrelazadas"
};
const mafe={
    "titulo":"titulo mafe",
    "personas":"personas mafe",
    "texto":"texto mafe"
};
const librerosUnidos={
    "titulo":"titulo librerosUnidos",
    "personas":"personas librerosUnidos",
    "texto":"texto librerosUnidos"
};

const ORDERED_RESOURCES=[libreria,historiasEntrelazadas,mafe,librerosUnidos];
const ORDERED_VIDEOS=[videoLibrerosUnidos,videoHistoriasEntrelazadas];


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

const createPlaneGeometryWithVideoTexture=(width,length,reference)=>{
    let geometry = new THREE.PlaneGeometry(width,length);
    let texture = new THREE.VideoTexture(reference);
    texture.minFilter= THREE.LinearFilter;
    texture.magFilter= THREE.LinearFilter;
    let material = new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
    let mesh = new THREE.Mesh(geometry,material);
    return mesh
};


//Create floor
const floorMesh=createPlaneGeometryWithRepeatingTexture(WIDTH,LENGTH,'images/piso.jpeg');
floorMesh.rotateX(Math.PI/2);
floorMesh.rotateY(-Math.PI);
floorMesh.position.setY(-Y_OFFSET);
scene.add(floorMesh);

//front wall
const frontWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgFront.jpg');
frontWallMesh.translateZ(-WIDTH/2);
frontWallMesh.translateY((LENGTH/2)-Y_OFFSET);
wallGroup.add(frontWallMesh);
//back wall
const backWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgBack.jpeg');
backWallMesh.translateZ(WIDTH/2);
backWallMesh.translateY((LENGTH/2)-Y_OFFSET);
wallGroup.add(backWallMesh);
//left wall
const leftWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgLeft.jpeg');
leftWallMesh.rotateY(Math.PI/2);
leftWallMesh.translateZ(LENGTH/2);
leftWallMesh.translateY((WIDTH/2)-Y_OFFSET);
wallGroup.add(leftWallMesh);
//right wall
const rightWallMesh=createPlaneGeometry(WIDTH,LENGTH,'images/imgRight.jpeg');
rightWallMesh.rotateY(Math.PI/2);
rightWallMesh.translateZ(-LENGTH/2);
rightWallMesh.translateY((WIDTH/2)-Y_OFFSET);
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
scene.add(ceilingMesh);

//Images story
const poster1Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/mafe.jpg');
poster1Mesh.rotateY(-Math.PI/2);
poster1Mesh.translateZ((-LENGTH/2)+1);
poster1Mesh.translateY(Y_OFFSET);
posterGroup.add(poster1Mesh);

const poster2Mesh=createPlaneGeometryWithVideoTexture(WIDTH/4,LENGTH/4,videoLibrerosUnidos);
poster2Mesh.rotateY(Math.PI/2);
poster2Mesh.translateZ((-LENGTH/2)+1);
poster2Mesh.translateY(Y_OFFSET);
posterGroup.add(poster2Mesh);

const poster3Mesh=createPlaneGeometryWithVideoTexture(WIDTH/4,LENGTH/4,videoHistoriasEntrelazadas);
poster3Mesh.translateZ((-LENGTH/2)+1);
poster3Mesh.translateY(Y_OFFSET);
posterGroup.add(poster3Mesh);

const poster4Mesh=createPlaneGeometry(WIDTH/4,LENGTH/4,'images/libreria.jpg');
poster4Mesh.translateZ((LENGTH/2)-1);
poster4Mesh.translateY(Y_OFFSET);
posterGroup.add(poster4Mesh);

posterGroup.children.forEach((p)=>{
    p.BoundingBox=new THREE.Box3();
    p.BoundingBox.setFromObject(p);
});


//Stories
const displayInfoCard=(info)=>{
    const infoElement=document.getElementById('historia-info');
    infoElement.innerHTML=`
        <h3>${info.titulo}</h3>
        <p>${info.personas}</p>
        <p>${info.texto}</p>
    `;
    infoElement.classList.add("show");
};

const hideInfoCard=()=>{
    const infoElement=document.getElementById('historia-info');
    infoElement.classList.remove("show");
};

const playVideo=(video)=>{
    video.play();
}

const pauseVideos=()=>{
    ORDERED_VIDEOS.forEach((v)=>{
        v.pause();
    });
};

//Controls

//Check collisions
const checkCollisionWall=()=>{
    const playerBoundingBox=new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(45,45,45)
    )
    for (let index = 0; index < wallGroup.children.length; index++) {
        const wall = wallGroup.children[index];
        if(playerBoundingBox.intersectsBox(wall.BoundingBox)){
            return true;
        }
    }
    return false;
};

const checkCollisionResource=()=>{
    const playerBoundingBox=new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(45,45,45)
    )
    for (let index = 0; index < posterGroup.children.length; index++) {
        const poster = posterGroup.children[index];
        if(playerBoundingBox.intersectsBox(poster.BoundingBox)){
            return true;
        }
    }
    return false;
};

const checkCollisionVideoResource=()=>{
    const playerBoundingBox=new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(45,45,45)
    )
    for (let index = 0; index < posterGroup.children.filter((p)=>p.material.map.constructor.name=="VideoTexture").length; index++) {
        const poster = posterGroup.children.filter((p)=>p.material.map.constructor.name=="VideoTexture")[index];
        if(playerBoundingBox.intersectsBox(poster.BoundingBox)){
            return true;
        }
    }
    return false;
};

const selectResourceAndCheckCollisionVideo=()=>{
    const playerBoundingBox=new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(45,45,45)
    )
    for (let index = 0; index < posterGroup.children.filter((p)=>p.material.map.constructor.name=="VideoTexture").length; index++) {
        const poster = posterGroup.children.filter((p)=>p.material.map.constructor.name=="VideoTexture")[index];
        if(playerBoundingBox.intersectsBox(poster.BoundingBox)){
            return index;
        }
    }
    return -1;
}

const selectResourceAndCheckCollisionPoster=()=>{
    const playerBoundingBox=new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(
        cameraWorldPosition,
        new THREE.Vector3(45,45,45)
    )
    for (let index = 0; index < posterGroup.children.length; index++) {
        const poster = posterGroup.children[index];
        if(playerBoundingBox.intersectsBox(poster.BoundingBox)){
            return index;
        }
    }
    return -1;
}

document.addEventListener('keydown', (event) => {
    //block Movement
    const isOnMenu=menu.style.display==='block' || menu.style.display==='';
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
            camera.translateZ(!checkCollisionWall() ? -SPEED*Math.cos(camera.position.y):  SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            }
            break;
        case 'ArrowDown':
            // Move backward in the opposite direction the camera is facing
            if(!isOnMenu){
            camera.translateZ(!checkCollisionWall() ? SPEED*Math.cos(camera.position.y): -SPEED*Math.cos(camera.position.y));
            camera.position.setY(FIX_Y);
            }
            break;
        case 'ArrowRight':
            // Move forward in the direction the camera is facing
            if(!isOnMenu){
            camera.translateX(!checkCollisionWall() ? SPEED*Math.cos(camera.position.y): - SPEED);
            camera.position.setY(FIX_Y);
            }
            break;
        case 'ArrowLeft':
            // Move backward in the opposite direction the camera is facing
            if(!isOnMenu){
            camera.translateX(!checkCollisionWall() ? -SPEED: SPEED);
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
        case "KeyH":
            helpMenu.style.display=(helpMenu.style.display==='block' || helpMenu.style.display==='') ? 'none' : 'block';
            break;
    }
    if(checkCollisionResource()){
        console.log(selectResourceAndCheckCollisionPoster());
        displayInfoCard(ORDERED_RESOURCES[selectResourceAndCheckCollisionPoster()]);
    }
    else{
        hideInfoCard();
    }

    if(checkCollisionVideoResource()){
        playVideo(ORDERED_VIDEOS[selectResourceAndCheckCollisionVideo()]);
    }
    else {
        pauseVideos()
    }
});


//Render
let animationLoop=function(){
    renderer.render(scene,camera);
    requestAnimationFrame(animationLoop);
};

animationLoop();