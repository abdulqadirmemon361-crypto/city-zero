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
// HUMAN PLAYER
// =========================

const player = new THREE.Group();

// Torso
const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.48, 1.1, 4, 8),
    new THREE.MeshStandardMaterial({
        color: 0x263f8f
    })
);

torso.position.y = 1.45;
player.add(torso);

// Head
const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 16, 12),
    new THREE.MeshStandardMaterial({
        color: 0xd69b72
    })
);

head.position.y = 2.55;
player.add(head);

// Hair
const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 8),
    new THREE.MeshStandardMaterial({
        color: 0x171717
    })
);

hair.scale.set(1, 0.55, 1);
hair.position.y = 2.78;
player.add(hair);

// Arms
const armGeometry = new THREE.CapsuleGeometry(0.16, 0.75, 4, 8);
const armMaterial = new THREE.MeshStandardMaterial({
    color: 0xd69b72
});

const leftArm = new THREE.Mesh(armGeometry, armMaterial);
const rightArm = new THREE.Mesh(armGeometry, armMaterial);

leftArm.position.set(-0.62, 1.45, 0);
rightArm.position.set(0.62, 1.45, 0);

leftArm.rotation.z = 0.08;
rightArm.rotation.z = -0.08;

player.add(leftArm);
player.add(rightArm);

// Legs
const legGeometry = new THREE.CapsuleGeometry(0.18, 0.9, 4, 8);

const leftLeg = new THREE.Mesh(
    legGeometry,
    new THREE.MeshStandardMaterial({ color: 0x202020 })
);

const rightLeg = new THREE.Mesh(
    legGeometry,
    new THREE.MeshStandardMaterial({ color: 0x202020 })
);

leftLeg.position.set(-0.25, 0.55, 0);
rightLeg.position.set(0.25, 0.55, 0);

player.add(leftLeg);
player.add(rightLeg);

// Player position
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

    // Walking animation
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
        player.position.y + 1.3,
        player.position.z
    );

    const cameraPosition = new THREE.Vector3(
        player.position.x,
        player.position.y + 4.5,
        player.position.z + 8
    );

    camera.position.lerp(cameraPosition, 0.12);

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
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
