import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const game = document.getElementById("game");

// =========================
// SCENE
// =========================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    70,
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

// =========================
// LIGHT
// =========================

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(20, 30, 10);
scene.add(sun);

const ambient = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    1.5
);

scene.add(ambient);

// =========================
// GROUND
// =========================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0x3f7044
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// =========================
// ROAD
// =========================

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 200),
    new THREE.MeshStandardMaterial({
        color: 0x303030
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
scene.add(road);

// =========================
// BUILDINGS
// =========================

function createBuilding(x, z, w, h, d) {

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
            color: 0x777777
        })
    );

    building.position.set(x, h / 2, z);
    scene.add(building);
}

createBuilding(-15, -15, 10, 18, 10);
createBuilding(15, -15, 12, 25, 12);
createBuilding(-15, 15, 9, 13, 9);
createBuilding(15, 15, 11, 20, 11);

// =========================
// PLAYER
// =========================

const player = new THREE.Group();

function material(color) {
    return new THREE.MeshStandardMaterial({
        color: color
    });
}

// =========================
// TORSO / SHIRT
// =========================

const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.05, 0.5),
    material(0x244a8f)
);

torso.position.y = 1.45;
player.add(torso);

// =========================
// SHOULDERS
// =========================

const shoulderGeometry = new THREE.SphereGeometry(
    0.23,
    10,
    8
);

const leftShoulder = new THREE.Mesh(
    shoulderGeometry,
    material(0x244a8f)
);

leftShoulder.position.set(-0.5, 1.82, 0);
player.add(leftShoulder);

const rightShoulder = new THREE.Mesh(
    shoulderGeometry,
    material(0x244a8f)
);

rightShoulder.position.set(0.5, 1.82, 0);
player.add(rightShoulder);

// =========================
// NECK
// =========================

const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.13,
        0.15,
        0.22,
        10
    ),
    material(0xc98f68)
);

neck.position.y = 2.08;
player.add(neck);

// =========================
// HEAD
// =========================

const head = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.39,
        16,
        12
    ),
    material(0xc98f68)
);

head.scale.set(0.95, 1.08, 0.95);
head.position.y = 2.5;
player.add(head);

// =========================
// HAIR
// =========================

const hair = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.405,
        16,
        10
    ),
    material(0x111111)
);

hair.scale.set(1, 0.52, 1);
hair.position.y = 2.78;
player.add(hair);

// =========================
// EARS
// =========================

const earGeometry = new THREE.SphereGeometry(
    0.09,
    8,
    8
);

const leftEar = new THREE.Mesh(
    earGeometry,
    material(0xc98f68)
);

leftEar.position.set(-0.38, 2.5, 0);
player.add(leftEar);

const rightEar = new THREE.Mesh(
    earGeometry,
    material(0xc98f68)
);

rightEar.position.set(0.38, 2.5, 0);
player.add(rightEar);

// =========================
// ARMS
// =========================

const armGeometry = new THREE.CapsuleGeometry(
    0.14,
    0.65,
    5,
    8
);

const leftArm = new THREE.Mesh(
    armGeometry,
    material(0x244a8f)
);

leftArm.position.set(-0.62, 1.42, 0);
player.add(leftArm);

const rightArm = new THREE.Mesh(
    armGeometry,
    material(0x244a8f)
);

rightArm.position.set(0.62, 1.42, 0);
player.add(rightArm);

// =========================
// HANDS
// =========================

const handGeometry = new THREE.SphereGeometry(
    0.14,
    10,
    8
);

const leftHand = new THREE.Mesh(
    handGeometry,
    material(0xc98f68)
);

leftHand.position.set(-0.62, 1.0, 0);
player.add(leftHand);

const rightHand = new THREE.Mesh(
    handGeometry,
    material(0xc98f68)
);

rightHand.position.set(0.62, 1.0, 0);
player.add(rightHand);

// =========================
// PANTS / LEGS
// =========================

const legGeometry = new THREE.CapsuleGeometry(
    0.17,
    0.85,
    5,
    8
);

const leftLeg = new THREE.Mesh(
    legGeometry,
    material(0x20252d)
);

leftLeg.position.set(-0.23, 0.55, 0);
player.add(leftLeg);

const rightLeg = new THREE.Mesh(
    legGeometry,
    material(0x20252d)
);

rightLeg.position.set(0.23, 0.55, 0);
player.add(rightLeg);

// =========================
// SHOES
// =========================

const shoeGeometry = new THREE.BoxGeometry(
    0.34,
    0.18,
    0.55
);

const leftShoe = new THREE.Mesh(
    shoeGeometry,
    material(0x111111)
);

leftShoe.position.set(
    -0.23,
    0.08,
    -0.08
);

player.add(leftShoe);

const rightShoe = new THREE.Mesh(
    shoeGeometry,
    material(0x111111)
);

rightShoe.position.set(
    0.23,
    0.08,
    -0.08
);

player.add(rightShoe);

// =========================
// PLAYER POSITION
// =========================

player.position.set(0, 0, 5);

scene.add(player);

// =========================
// CONTROLS
// =========================

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// =========================
// MOVEMENT
// =========================

let velocityY = 0;
let grounded = true;

const speed = 0.12;
const gravity = -0.015;
const jumpPower = 0.32;

function updatePlayer() {

    let moving = false;

    if (keys["w"]) {
        player.translateZ(-speed);
        moving = true;
    }

    if (keys["s"]) {
        player.translateZ(speed);
        moving = true;
    }

    if (keys["a"]) {
        player.rotation.y += 0.045;
    }

    if (keys["d"]) {
        player.rotation.y -= 0.045;
    }

    // Jump
    if (keys[" "] && grounded) {
        velocityY = jumpPower;
        grounded = false;
    }

    velocityY += gravity;
    player.position.y += velocityY;

    if (player.position.y <= 0) {
        player.position.y = 0;
        velocityY = 0;
        grounded = true;
    }

    // =========================
    // WALK ANIMATION
    // =========================

    if (moving && grounded) {

        const walk =
            Math.sin(Date.now() * 0.015) * 0.5;

        leftLeg.rotation.x = walk;
        rightLeg.rotation.x = -walk;

        leftArm.rotation.x = -walk;
        rightArm.rotation.x = walk;

    } else {

        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;

        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
    }
}

// =========================
// CAMERA
// =========================

function updateCamera() {

    const target = new THREE.Vector3(
        player.position.x,
        player.position.y + 1.35,
        player.position.z
    );

    const cameraPosition = new THREE.Vector3(
        player.position.x,
        player.position.y + 4.2,
        player.position.z + 7
    );

    camera.position.lerp(
        cameraPosition,
        0.12
    );

    camera.lookAt(target);
}

// =========================
// GAME LOOP
// =========================

function animate() {

    requestAnimationFrame(animate);

    updatePlayer();
    updateCamera();

    renderer.render(scene, camera);
}

animate();

// =========================
// RESIZE
// =========================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
