import * as THREE from 'three';

export class InputController {
    constructor(camera, gameScene) {
        this.camera = camera;
        this.gameScene = gameScene;
        this.keys = {};
        this.isMouseDown = false;
        this.mouseDelta = { x: 0, y: 0 };
        this.velocity = new THREE.Vector3();
        this.speed = 50;
        this.boostMultiplier = 1.5;
        this.currentBoost = 1;

        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseDelta.x = e.movementX;
            this.mouseDelta.y = e.movementY;
        });

        document.addEventListener('mousedown', () => {
            this.isMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        // Lock pointer on click
        document.addEventListener('click', () => {
            document.body.requestPointerLock();
        });
    }

    update() {
        // Handle boost
        this.currentBoost = this.keys[' '] ? this.boostMultiplier : 1;

        // Camera rotation (mouse look)
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this.camera.quaternion);
        euler.rotateY(-this.mouseDelta.x * 0.002);
        euler.rotateX(-this.mouseDelta.y * 0.002);
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
        this.camera.quaternion.setFromEuler(euler);

        // Forward movement
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);

        const right = new THREE.Vector3();
        right.crossVectors(this.camera.up, forward).normalize();

        const up = new THREE.Vector3();
        up.crossVectors(forward, right).normalize();

        // Build movement vector
        let moveVector = new THREE.Vector3();

        if (this.keys['w']) moveVector.add(forward);
        if (this.keys['s']) moveVector.sub(forward);
        if (this.keys['d']) moveVector.add(right);
        if (this.keys['a']) moveVector.sub(right);
        if (this.keys['q']) moveVector.add(up);
        if (this.keys['e']) moveVector.sub(up);

        // Apply movement
        if (moveVector.length() > 0) {
            moveVector.normalize();
            moveVector.multiplyScalar(this.speed * this.currentBoost * 0.01667);
            this.camera.position.add(moveVector);
        }

        // Reset mouse delta
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
    }
}
