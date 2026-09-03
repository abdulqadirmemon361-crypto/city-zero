import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ==========================
// CITY-ZERO — 3D FOUNDATION
// ==========================

const game = document.getElementById("game");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "low-power"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

game.innerHTML = "";
game.appendChild(renderer.domElement);

// ==========================
// LIGHT
// ==========================

const light = new THREE.HemisphereLight(
    0xffffff,
    0x555555,
    2
);

scene.add(light);

// ==========================
// GROUND
// ==========================

const groundGeometry = new THREE.PlaneGeometry(200, 200);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d7040
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

// ==========================
// TEST BUILDINGS
// ==========================

function createBuilding(x, z, width, height, depth) {

    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x777777
    });

    const building = new THREE.Mesh(
        geometry,
        material
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);
}

// Small test city

createBuilding(-12, -10, 8, 12, 8);
createBuilding(12, -10, 10, 18, 10);
createBuilding(-12, 12, 7, 8, 7);
createBuilding(12, 12, 9, 14, 9);

// ==========================
// RESIZE
// ==========================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// ==========================
// GAME LOOP
// ==========================

function animate() {

    requestAnimationFrame(animate);

    renderer.render(
        scene,
        camera
    );
}

animate();
