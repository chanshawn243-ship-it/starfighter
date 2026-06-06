import * as THREE from 'three';
import { TIEDefender } from './models/TIEDefender.js';
import { GameScene } from './game/GameScene.js';
import { InputController } from './controllers/InputController.js';
import { HUDManager } from './ui/HUDManager.js';

let scene, camera, renderer, gameScene, inputController, hudManager;
let gameRunning = false;
let gamePaused = false;

function init() {
    // Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    scene.fog = new THREE.Fog(0x000011, 500, 2000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 5, 20);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4488cc, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 1000;
    scene.add(directionalLight);

    // Game Scene
    gameScene = new GameScene(scene, camera);

    // Input Controller
    inputController = new InputController(camera, gameScene);

    // HUD Manager
    hudManager = new HUDManager();

    // UI Event Listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resumeBtn').addEventListener('click', resumeGame);
    document.getElementById('menuBtn').addEventListener('click', mainMenu);

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Pause on P key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            if (gameRunning) {
                togglePause();
            }
        }
    });

    animate();
}

function startGame() {
    document.getElementById('menu').classList.add('hidden');
    gameRunning = true;
    gamePaused = false;
    gameScene.start();
}

function togglePause() {
    gamePaused = !gamePaused;
    document.getElementById('pauseMenu').style.display = gamePaused ? 'block' : 'none';
}

function resumeGame() {
    gamePaused = false;
    document.getElementById('pauseMenu').style.display = 'none';
}

function mainMenu() {
    gameRunning = false;
    gamePaused = false;
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('menu').classList.remove('hidden');
    gameScene.reset();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (!gamePaused && gameRunning) {
        inputController.update();
        gameScene.update(inputController);
        hudManager.update(gameScene);
    }

    renderer.render(scene, camera);
}

init();
