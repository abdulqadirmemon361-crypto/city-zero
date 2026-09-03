import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const game = document.getElementById("game");

// =====================
// SCENE
// =====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "low-power"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

game.innerHTML = "";
game.appendChild(renderer.domElement);

// =====================
// LIGHT
// =====================

const light = new THREE.HemisphereLight(
    0xffffff,
    0x555555,
    2
);

scene.add(light);

// =====================
// GROUND
// =====================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0x3d7040
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// =====================
// BUILDINGS
// =====================

function createBuilding(x, z, width, height, depth) {

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({
            color: 0x777777
        })
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);
}

createBuilding(-12, -10, 8, 12, 8);
createBuilding(12, -10, 10, 18, 10);
createBuilding(-12, 12, 7, 8, 7);
createBuilding(12, 12, 9, 14, 9);

// =====================
// PLAYER
// =====================

const player = new THREE.Group();

// Body
const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 0.6),
    new THREE.MeshStandardMaterial({
        color: 0x2244aa
    })
);

body.position.y = 1.5;
player.add(body);

// Head
const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 12, 12),
    new THREE.MeshStandardMaterial({
        color: 0xffcc99
    })
);

head.position.y = 2.55;
player.add(head);

// Legs
const legGeometry = new THREE.BoxGeometry(0.35, 1, 0.4);
const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222
});

const leftLeg = new THREE.Mesh(
    legGeometry,
    legMaterial
);

const rightLeg = new THREE.Mesh(
    legGeometry,
    legMaterial
);

leftLeg.position.set(-0.22, 0.5, 0);
rightLeg.position.set(0.22, 0.5, 0);

player.add(leftLeg);
player.add(rightLeg);

player.position.set(0, 0, 8);

scene.add(player);

// =====================
// MOVEMENT
// =====================

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

let velocityY = 0;
let grounded = true;

const speed = 0.12;
const gravity = -0.015;
const jumpPower = 0.32;

// =====================
// CAMERA
// =====================

function updateCamera() {

    const cameraOffset = new THREE.Vector3(
        0,
        5,
        8
    );

    cameraOffset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        player.rotation.y
    );

    camera.position.lerp(
        player.position.clone().add(cameraOffset),
        0.12
    );

    camera.lookAt(
        player.position.x,
        player.position.y + 1.3,
        player.position.z
    );
}

// =====================
// GAME LOOP
// =====================

function animate() {

    requestAnimationFrame(animate);

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
        player.rotation.y += 0.04;
    }

    if (keys["d"]) {
        player.rotation.y -= 0.04;
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

    // Simple walking animation
    if (moving && grounded) {
        const walk = Math.sin(Date.now() * 0.015) * 0.5;

        leftLeg.rotation.x = walk;
        rightLeg.rotation.x = -walk;
    } else {
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
    }

    updateCamera();

    renderer.render(scene, camera);
}

// =====================
// RESIZE
// =====================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

animate();
