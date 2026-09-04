import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const game = document.getElementById("game");

// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "low-power"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.25)
);

game.innerHTML = "";
game.appendChild(renderer.domElement);

// =====================================================
// LIGHT
// =====================================================

const sun = new THREE.DirectionalLight(
    0xffffff,
    2.2
);

sun.position.set(30, 40, 20);
scene.add(sun);

const ambient = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    1.5
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
// ROAD LINES
// =====================================================

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

for (let z = -120; z < 120; z += 8) {

    const line = new THREE.Mesh(
        new THREE.PlaneGeometry(0.22, 4),
        lineMaterial
    );

    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.035, z);

    scene.add(line);
}

// =====================================================
// BUILDINGS
// =====================================================

function createBuilding(x, z, w, h, d) {

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
            color: 0x707070
        })
    );

    building.position.set(
        x,
        h / 2,
        z
    );

    scene.add(building);
}

createBuilding(-18, -20, 12, 20, 12);
createBuilding(18, -20, 13, 28, 13);
createBuilding(-18, 20, 10, 15, 10);
createBuilding(18, 20, 12, 23, 12);

// =====================================================
// PLAYER ROOT
// =====================================================

const player = new THREE.Group();

player.position.set(
    0,
    0,
    5
);

scene.add(player);

// =====================================================
// GLB CHARACTER
// =====================================================

// IMPORTANT:
// Put your GLB here:
//
// assets/player.glb

const MODEL_URL = "./assets/player.glb";

const loader = new GLTFLoader();

let character = null;
let mixer = null;

const animations = {};

let currentAnimation = null;

// =====================================================
// LOAD CHARACTER
// =====================================================

loader.load(

    MODEL_URL,

    function (gltf) {

        character = gltf.scene;

        // Model size
        character.scale.set(
            1,
            1,
            1
        );

        // If your model faces backwards,
// change this to Math.PI
        character.rotation.y = Math.PI;

        player.add(character);

        // =================================================
        // ANIMATIONS
        // =================================================

        if (gltf.animations.length > 0) {

            mixer = new THREE.AnimationMixer(
                character
            );

            gltf.animations.forEach(
                (clip) => {

                    animations[
                        clip.name.toLowerCase()
                    ] = mixer.clipAction(clip);
                }
            );

            console.log(
                "Animations found:",
                gltf.animations.map(
                    a => a.name
                )
            );

            // Try idle first
            playAnimation(
                findAnimation([
                    "idle",
                    "standing",
                    "breathing"
                ])
            );
        }

        console.log(
            "Character loaded successfully."
        );
    },

    function (progress) {

        if (progress.total > 0) {

            console.log(
                "Character loading:",
                Math.round(
                    progress.loaded /
                    progress.total *
                    100
                ) + "%"
            );
        }
    },

    function (error) {

        console.error(
            "CHARACTER LOAD ERROR:",
            error
        );

        console.log(
            "Make sure assets/player.glb exists."
        );
    }
);

// =====================================================
// FIND ANIMATION
// =====================================================

function findAnimation(names) {

    for (const name of names) {

        if (animations[name]) {
            return animations[name];
        }
    }

    // If no matching name,
// use first available animation

    const keys = Object.keys(animations);

    if (keys.length > 0) {
        return animations[keys[0]];
    }

    return null;
}

// =====================================================
// PLAY ANIMATION
// =====================================================

function playAnimation(action) {

    if (!action) {
        return;
    }

    if (currentAnimation === action) {
        return;
    }

    if (currentAnimation) {

        currentAnimation.fadeOut(0.2);
    }

    action
        .reset()
        .fadeIn(0.2)
        .play();

    currentAnimation = action;
}

// =====================================================
// CONTROLS
// =====================================================

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.key.toLowerCase()] = true;

        if (event.key === " ") {
            event.preventDefault();
        }
    }
);

window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key.toLowerCase()] = false;
    }
);

// =====================================================
// PLAYER MOVEMENT
// =====================================================

let velocityY = 0;
let grounded = true;

const walkSpeed = 0.09;
const runSpeed = 0.16;

const gravity = -0.015;
const jumpPower = 0.34;

function updatePlayer(delta) {

    let moving = false;

    // ---------------------------------------------
    // SPEED
    // ---------------------------------------------

    let speed = walkSpeed;

    if (keys["shift"]) {
        speed = runSpeed;
    }

    // ---------------------------------------------
    // FORWARD
    // ---------------------------------------------

    if (keys["w"]) {

        player.translateZ(-speed);

        moving = true;
    }

    // ---------------------------------------------
    // BACKWARD
    // ---------------------------------------------

    if (keys["s"]) {

        player.translateZ(speed);

        moving = true;
    }

    // ---------------------------------------------
    // TURN
    // ---------------------------------------------

    if (keys["a"]) {

        player.rotation.y += 0.045;
    }

    if (keys["d"]) {

        player.rotation.y -= 0.045;
    }

    // ---------------------------------------------
    // JUMP
    // ---------------------------------------------

    if (
        keys[" "] &&
        grounded
    ) {

        velocityY = jumpPower;
        grounded = false;
    }

    // ---------------------------------------------
    // GRAVITY
    // ---------------------------------------------

    velocityY += gravity;

    player.position.y += velocityY;

    if (player.position.y <= 0) {

        player.position.y = 0;

        velocityY = 0;

        grounded = true;
    }

    // ---------------------------------------------
    // ANIMATIONS
    // ---------------------------------------------

    if (mixer) {

        if (moving) {

            if (keys["shift"]) {

                playAnimation(
                    findAnimation([
                        "run",
                        "running",
                        "sprint"
                    ])
                );

            } else {

                playAnimation(
                    findAnimation([
                        "walk",
                        "walking"
                    ])
                );
            }

        } else {

            playAnimation(
                findAnimation([
                    "idle",
                    "standing",
                    "breathing"
                ])
            );
        }

        mixer.update(delta);
    }
}

// =====================================================
// THIRD PERSON CAMERA
// =====================================================

const desiredCamera = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();

function updateCamera() {

    // Camera distance behind character

    const offset = new THREE.Vector3(
        0,
        3.4,
        6.5
    );

    // Follow player's rotation

    offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        player.rotation.y
    );

    desiredCamera.copy(
        player.position
    );

    desiredCamera.add(offset);

    // Smooth camera

    camera.position.lerp(
        desiredCamera,
        0.10
    );

    // Look at upper body

    cameraTarget.set(
        player.position.x,
        player.position.y + 1.35,
        player.position.z
    );

    camera.lookAt(
        cameraTarget
    );
}

// =====================================================
// CLOCK
// =====================================================

const clock = new THREE.Clock();

// =====================================================
// GAME LOOP
// =====================================================

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    updatePlayer(delta);

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
