import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const game = document.getElementById("game");

// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    68,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "low-power"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

game.innerHTML = "";
game.appendChild(renderer.domElement);

// =====================================================
// LIGHT
// =====================================================

const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(30, 40, 20);
scene.add(sun);

const ambient = new THREE.HemisphereLight(
    0xffffff,
    0x555555,
    1.4
);

scene.add(ambient);

// =====================================================
// GROUND
// =====================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 250),
    new THREE.MeshStandardMaterial({
        color: 0x3f7044
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// =====================================================
// ROAD
// =====================================================

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 250),
    new THREE.MeshStandardMaterial({
        color: 0x303030
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = 0.02;
scene.add(road);

// =====================================================
// ROAD LINE
// =====================================================

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

for (let z = -120; z < 120; z += 8) {

    const line = new THREE.Mesh(
        new THREE.PlaneGeometry(0.25, 4),
        lineMaterial
    );

    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.035, z);

    scene.add(line);
}

// =====================================================
// BUILDINGS
// =====================================================

function createBuilding(x, z, width, height, depth) {

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        new THREE.MeshStandardMaterial({
            color: 0x707070
        })
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);
}

createBuilding(-18, -20, 12, 20, 12);
createBuilding(18, -20, 13, 28, 13);

createBuilding(-18, 20, 10, 15, 10);
createBuilding(18, 20, 12, 23, 12);

// =====================================================
// PLAYER
// =====================================================

const player = new THREE.Group();

function makeMaterial(color) {

    return new THREE.MeshStandardMaterial({
        color: color
    });
}

// =====================================================
// BODY
// =====================================================

// Chest
const chest = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.95,
        0.9,
        0.48
    ),
    makeMaterial(0x294d8f)
);

chest.position.y = 1.55;
player.add(chest);

// Waist
const waist = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.72,
        0.35,
        0.42
    ),
    makeMaterial(0x294d8f)
);

waist.position.y = 1.0;
player.add(waist);

// =====================================================
// NECK
// =====================================================

const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.13,
        0.15,
        0.22,
        10
    ),
    makeMaterial(0xc98f68)
);

neck.position.y = 2.12;
player.add(neck);

// =====================================================
// HEAD
// =====================================================

const head = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.40,
        16,
        12
    ),
    makeMaterial(0xc98f68)
);

head.scale.set(
    0.92,
    1.08,
    0.92
);

head.position.y = 2.52;
player.add(head);

// =====================================================
// HAIR
// =====================================================

const hair = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.415,
        16,
        10
    ),
    makeMaterial(0x151515)
);

hair.scale.set(
    1,
    0.48,
    0.98
);

hair.position.y = 2.80;
player.add(hair);

// =====================================================
// SHOULDERS
// =====================================================

const shoulderGeometry =
    new THREE.SphereGeometry(
        0.22,
        10,
        8
    );

const leftShoulder = new THREE.Mesh(
    shoulderGeometry,
    makeMaterial(0x294d8f)
);

leftShoulder.position.set(
    -0.55,
    1.82,
    0
);

player.add(leftShoulder);

const rightShoulder = new THREE.Mesh(
    shoulderGeometry,
    makeMaterial(0x294d8f)
);

rightShoulder.position.set(
    0.55,
    1.82,
    0
);

player.add(rightShoulder);

// =====================================================
// ARMS
// =====================================================

const upperArmGeometry =
    new THREE.CylinderGeometry(
        0.13,
        0.15,
        0.55,
        8
    );

const forearmGeometry =
    new THREE.CylinderGeometry(
        0.11,
        0.13,
        0.52,
        8
    );

// LEFT ARM

const leftUpperArm = new THREE.Mesh(
    upperArmGeometry,
    makeMaterial(0x294d8f)
);

leftUpperArm.position.set(
    -0.65,
    1.55,
    0
);

player.add(leftUpperArm);

const leftForearm = new THREE.Mesh(
    forearmGeometry,
    makeMaterial(0xc98f68)
);

leftForearm.position.set(
    -0.65,
    1.10,
    0
);

player.add(leftForearm);

// RIGHT ARM

const rightUpperArm = new THREE.Mesh(
    upperArmGeometry,
    makeMaterial(0x294d8f)
);

rightUpperArm.position.set(
    0.65,
    1.55,
    0
);

player.add(rightUpperArm);

const rightForearm = new THREE.Mesh(
    forearmGeometry,
    makeMaterial(0xc98f68)
);

rightForearm.position.set(
    0.65,
    1.10,
    0
);

player.add(rightForearm);

// =====================================================
// HANDS
// =====================================================

const handGeometry =
    new THREE.SphereGeometry(
        0.14,
        10,
        8
    );

const leftHand = new THREE.Mesh(
    handGeometry,
    makeMaterial(0xc98f68)
);

leftHand.position.set(
    -0.65,
    0.78,
    0
);

player.add(leftHand);

const rightHand = new THREE.Mesh(
    handGeometry,
    makeMaterial(0xc98f68)
);

rightHand.position.set(
    0.65,
    0.78,
    0
);

player.add(rightHand);

// =====================================================
// LEGS
// =====================================================

const thighGeometry =
    new THREE.CylinderGeometry(
        0.18,
        0.20,
        0.62,
        8
    );

const shinGeometry =
    new THREE.CylinderGeometry(
        0.14,
        0.17,
        0.62,
        8
    );

// LEFT LEG

const leftThigh = new THREE.Mesh(
    thighGeometry,
    makeMaterial(0x20252d)
);

leftThigh.position.set(
    -0.23,
    0.65,
    0
);

player.add(leftThigh);

const leftShin = new THREE.Mesh(
    shinGeometry,
    makeMaterial(0x20252d)
);

leftShin.position.set(
    -0.23,
    0.25,
    0
);

player.add(leftShin);

// RIGHT LEG

const rightThigh = new THREE.Mesh(
    thighGeometry,
    makeMaterial(0x20252d)
);

rightThigh.position.set(
    0.23,
    0.65,
    0
);

player.add(rightThigh);

const rightShin = new THREE.Mesh(
    shinGeometry,
    makeMaterial(0x20252d)
);

rightShin.position.set(
    0.23,
    0.25,
    0
);

player.add(rightShin);

// =====================================================
// SHOES
// =====================================================

const shoeGeometry =
    new THREE.BoxGeometry(
        0.34,
        0.18,
        0.55
    );

const leftShoe = new THREE.Mesh(
    shoeGeometry,
    makeMaterial(0x101010)
);

leftShoe.position.set(
    -0.23,
    0.09,
    -0.10
);

player.add(leftShoe);

const rightShoe = new THREE.Mesh(
    shoeGeometry,
    makeMaterial(0x101010)
);

rightShoe.position.set(
    0.23,
    0.09,
    -0.10
);

player.add(rightShoe);

// =====================================================
// PLAYER START
// =====================================================

player.position.set(
    0,
    0,
    5
);

scene.add(player);

// =====================================================
// CONTROLS
// =====================================================

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.key.toLowerCase()] = true;
    }
);

window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key.toLowerCase()] = false;
    }
);

// =====================================================
// MOVEMENT
// =====================================================

let velocityY = 0;
let grounded = true;

const speed = 0.13;
const gravity = -0.015;
const jumpPower = 0.34;

function updatePlayer() {

    let moving = false;

    // Forward
    if (keys["w"]) {

        player.translateZ(-speed);
        moving = true;
    }

    // Back
    if (keys["s"]) {

        player.translateZ(speed);
        moving = true;
    }

    // Turn left
    if (keys["a"]) {

        player.rotation.y += 0.045;
    }

    // Turn right
    if (keys["d"]) {

        player.rotation.y -= 0.045;
    }

    // Jump
    if (keys[" "] && grounded) {

        velocityY = jumpPower;
        grounded = false;
    }

    // Gravity
    velocityY += gravity;

    player.position.y += velocityY;

    if (player.position.y <= 0) {

        player.position.y = 0;
        velocityY = 0;
        grounded = true;
    }

    // =================================================
    // WALK ANIMATION
    // =================================================

    if (moving && grounded) {

        const walk =
            Math.sin(Date.now() * 0.014) * 0.45;

        leftThigh.rotation.x = walk;
        rightThigh.rotation.x = -walk;

        leftShin.rotation.x = -walk * 0.5;
        rightShin.rotation.x = walk * 0.5;

        leftUpperArm.rotation.x = -walk * 0.7;
        rightUpperArm.rotation.x = walk * 0.7;

        leftForearm.rotation.x = -walk * 0.5;
        rightForearm.rotation.x = walk * 0.5;

    } else {

        leftThigh.rotation.x = 0;
        rightThigh.rotation.x = 0;

        leftShin.rotation.x = 0;
        rightShin.rotation.x = 0;

        leftUpperArm.rotation.x = 0;
        rightUpperArm.rotation.x = 0;

        leftForearm.rotation.x = 0;
        rightForearm.rotation.x = 0;
    }
}

// =====================================================
// THIRD-PERSON CAMERA
// =====================================================

const cameraTarget = new THREE.Vector3();
const desiredCamera = new THREE.Vector3();

function updateCamera() {

    // Character ke peeche camera
    const offset = new THREE.Vector3(
        0,
        3.8,
        6.8
    );

    offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        player.rotation.y
    );

    desiredCamera.copy(
        player.position
    );

    desiredCamera.add(offset);

    camera.position.lerp(
        desiredCamera,
        0.10
    );

    cameraTarget.set(
        player.position.x,
        player.position.y + 1.35,
        player.position.z
    );

    camera.lookAt(cameraTarget);
}

// =====================================================
// GAME LOOP
// =====================================================

function animate() {

    requestAnimationFrame(animate);

    updatePlayer();
    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

animate();

// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
