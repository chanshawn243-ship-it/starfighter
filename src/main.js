import * as THREE from 'three';

let scene, camera, renderer, gameRunning = false, gamePaused = false;
let particles = [];
let playerPos = { x: 0, y: 0, z: 0 };
let enemies = [];

function init() {
    // Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    scene.fog = new THREE.Fog(0x000011, 500, 5000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 5, 20);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp', alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4488cc, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 1000;
    scene.add(directionalLight);

    // Create 3D parallax starfield
    createStarField();

    // Create TIE Defender player ship
    createPlayerShip();

    // Create enemy ships
    createEnemies();

    // UI Event Listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resumeBtn').addEventListener('click', resumeGame);
    document.getElementById('menuBtn').addEventListener('click', mainMenu);

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Keyboard controls
    const keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
        keys[e.key] = false;
    });

    // Store keys for update loop
    window.gameKeys = keys;

    animate();
}

function createStarField() {
    const starCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const idx = i * 3;
        positions[idx] = (Math.random() - 0.5) * 4000;
        positions[idx + 1] = (Math.random() - 0.5) * 4000;
        positions[idx + 2] = (Math.random() - 0.5) * 4000;

        // Star colors
        const starColor = Math.random();
        if (starColor > 0.8) {
            colors[idx] = 0.3;
            colors[idx + 1] = 0.7;
            colors[idx + 2] = 1;
        } else if (starColor > 0.6) {
            colors[idx] = 1;
            colors[idx + 1] = 0.8;
            colors[idx + 2] = 0.3;
        } else {
            colors[idx] = 1;
            colors[idx + 1] = 1;
            colors[idx + 2] = 1;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        sRGBColorSpace: true
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

function createPlayerShip() {
    const group = new THREE.Group();

    // Main cockpit
    const cockpitGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const cockpitMat = new THREE.MeshPhongMaterial({
        color: 0x333333,
        shininess: 100,
        emissive: 0x111111
    });
    const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    group.add(cockpit);

    // Fuselage
    const fuselageGeom = new THREE.BoxGeometry(0.4, 0.4, 2);
    const fuselageMat = new THREE.MeshPhongMaterial({
        color: 0x222222,
        shininess: 80
    });
    const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat);
    fuselage.position.z = -1.2;
    fuselage.castShadow = true;
    group.add(fuselage);

    // Wings (solar panels)
    const wingMat = new THREE.MeshPhongMaterial({
        color: 0x0a0a0a,
        shininess: 40
    });

    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const wingGeom = new THREE.BoxGeometry(2.2, 2.2, 0.1);
        const wing = new THREE.Mesh(wingGeom, wingMat);
        wing.position.set(
            Math.cos(angle) * 2.5,
            Math.sin(angle) * 2.5,
            0
        );
        wing.rotation.z = angle;
        wing.castShadow = true;
        group.add(wing);
    }

    // Engine glow
    const engineGeom = new THREE.CylinderGeometry(0.4, 0.35, 0.3, 16);
    const engineMat = new THREE.MeshPhongMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 0.8
    });
    const engine = new THREE.Mesh(engineGeom, engineMat);
    engine.position.z = -2.5;
    engine.castShadow = true;
    group.add(engine);

    // Engine light
    const engineLight = new THREE.PointLight(0xff6644, 1.5, 50);
    engineLight.position.z = -2.5;
    group.add(engineLight);

    group.position.copy(playerPos);
    group.scale.set(1.5, 1.5, 1.5);
    scene.add(group);
    window.playerShip = group;
}

function createEnemies() {
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = (Math.random() - 0.5) * 30;

        const group = new THREE.Group();

        // Simple enemy ship
        const bodyGeom = new THREE.BoxGeometry(0.3, 0.3, 1);
        const bodyMat = new THREE.MeshPhongMaterial({
            color: 0x444444,
            emissive: 0x220000
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.castShadow = true;
        group.add(body);

        // Enemy glow
        const glowLight = new THREE.PointLight(0xff3300, 0.8, 30);
        group.add(glowLight);

        group.position.set(x, y, z);
        scene.add(group);

        enemies.push({
            mesh: group,
            x, y, z,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.5) * 10,
            vz: (Math.random() - 0.5) * 30,
            targetChangeTimer: 0
        });
    }
}

function startGame() {
    document.getElementById('menu').classList.add('hidden');
    gameRunning = true;
    gamePaused = false;
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
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updatePlayer() {
    const keys = window.gameKeys || {};
    const speed = 0.5;

    // Arrow keys
    if (keys['arrowup'] || keys['w']) playerPos.z -= speed;
    if (keys['arrowdown'] || keys['s']) playerPos.z += speed;
    if (keys['arrowleft'] || keys['a']) playerPos.x -= speed;
    if (keys['arrowright'] || keys['d']) playerPos.x += speed;
    if (keys['q']) playerPos.y += speed;
    if (keys['e']) playerPos.y -= speed;

    if (window.playerShip) {
        window.playerShip.position.copy(playerPos);
    }

    // Update camera to follow player
    const targetX = playerPos.x;
    const targetY = playerPos.y + 5;
    const targetZ = playerPos.z + 20;

    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
    camera.lookAt(playerPos.x, playerPos.y, playerPos.z);
}

function updateEnemies() {
    enemies.forEach((enemy, idx) => {
        enemy.targetChangeTimer--;
        if (enemy.targetChangeTimer < 0) {
            enemy.vx = (Math.random() - 0.5) * 40;
            enemy.vy = (Math.random() - 0.5) * 20;
            enemy.vz = (Math.random() - 0.5) * 40;
            enemy.targetChangeTimer = 120;
        }

        enemy.x += enemy.vx * 0.016;
        enemy.y += enemy.vy * 0.016;
        enemy.z += enemy.vz * 0.016;

        // Boundary wrapping
        if (Math.abs(enemy.x) > 200) enemy.vx *= -1;
        if (Math.abs(enemy.y) > 150) enemy.vy *= -1;
        if (Math.abs(enemy.z) > 200) enemy.vz *= -1;

        enemy.mesh.position.set(enemy.x, enemy.y, enemy.z);

        // Look at player
        const dirX = playerPos.x - enemy.x;
        const dirZ = playerPos.z - enemy.z;
        enemy.mesh.rotation.z = Math.atan2(dirX, dirZ);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (!gamePaused && gameRunning) {
        updatePlayer();
        updateEnemies();
    }

    // Rotate stars for parallax effect
    scene.children.forEach(child => {
        if (child instanceof THREE.Points) {
            child.rotation.x += 0.00001;
            child.rotation.y += 0.00002;
        }
    });

    // Update HUD
    document.getElementById('threatLevel').textContent = enemies.length > 0 ? 'HIGH' : 'CLEAR';
    const nearestEnemy = enemies.reduce((min, e) => {
        const dist = Math.sqrt(
            Math.pow(e.x - playerPos.x, 2) +
            Math.pow(e.z - playerPos.z, 2)
        );
        return dist < min.dist ? { dist, enemy: e } : min;
    }, { dist: Infinity });
    document.getElementById('distance').textContent = Math.round(nearestEnemy.dist);

    renderer.render(scene, camera);
}

// Keyboard event for pause
document.addEventListener('keydown', (e) => {
    if ((e.key === 'p' || e.key === 'P') && gameRunning) {
        togglePause();
    }
});

init();
