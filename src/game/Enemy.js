import * as THREE from 'three';
import { TIEDefender } from '../models/TIEDefender.js';

export class Enemy {
    constructor(startPos, scene, playerCamera) {
        this.scene = scene;
        this.playerCamera = playerCamera;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 20 + Math.random() * 10;
        this.position = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
        this.velocity = new THREE.Vector3();
        this.targetPosition = this.position.clone();
        this.updateTargetPosition();

        // Create ship model
        this.ship = new TIEDefender();
        this.ship.position.copy(this.position);
        this.scene.add(this.ship);

        // Health bar
        this.healthBar = this.createHealthBar();
        this.scene.add(this.healthBar);

        this.timeSinceLastDirectionChange = 0;
        this.directionChangeInterval = 2000 + Math.random() * 3000;
    }

    createHealthBar() {
        const group = new THREE.Group();

        // Background
        const bgGeom = new THREE.PlaneGeometry(3, 0.3);
        const bgMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const bg = new THREE.Mesh(bgGeom, bgMat);
        bg.position.z = 0.01;
        group.add(bg);

        // Health bar
        this.healthBarMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 0.3),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        this.healthBarMesh.position.z = 0.02;
        group.add(this.healthBarMesh);

        group.position.copy(this.position);
        group.position.y += 4;

        return group;
    }

    takeDamage(damage) {
        this.health -= damage;
        this.health = Math.max(0, this.health);
        this.updateHealthBar();
    }

    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        this.healthBarMesh.scale.x = healthPercent;
        this.healthBarMesh.material.color.setHex(
            healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000
        );
    }

    updateTargetPosition() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const height = (Math.random() - 0.5) * 50;

        this.targetPosition = new THREE.Vector3(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
        );
    }

    update(playerPosition) {
        // Occasionally change direction
        this.timeSinceLastDirectionChange += 16.67;
        if (this.timeSinceLastDirectionChange > this.directionChangeInterval) {
            this.updateTargetPosition();
            this.timeSinceLastDirectionChange = 0;
        }

        // Move towards target
        const direction = this.targetPosition.clone().sub(this.position).normalize();
        this.velocity = direction.multiplyScalar(this.speed);
        this.position.add(this.velocity.multiplyScalar(0.01667));

        // Look towards player
        const lookDirection = playerPosition.clone().sub(this.position).normalize();
        const targetRotation = new THREE.Quaternion();
        targetRotation.setFromUnitVectors(new THREE.Vector3(0, 0, 1), lookDirection);
        this.ship.quaternion.slerp(targetRotation, 0.1);

        this.ship.position.copy(this.position);
        this.healthBar.position.copy(this.position);
        this.healthBar.position.y += 4;
        this.healthBar.lookAt(playerPosition);
    }

    dispose() {
        this.scene.remove(this.ship);
        this.scene.remove(this.healthBar);
    }
}
