import * as THREE from 'three';

export class Projectile {
    constructor(position, direction, scene) {
        this.scene = scene;
        this.position = position.clone();
        this.direction = direction.normalize();
        this.speed = 200;
        this.lifetime = 10000; // 10 seconds
        this.age = 0;
        this.shouldRemove = false;
        this.damage = 25;
        this.collisionRadius = 1;

        // Create projectile mesh
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Projectile glow
        const glowGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(this.position);
        this.scene.add(glow);
        this.glow = glow;

        // Trail
        this.trailPoints = [this.position.clone()];
        this.trail = this.createTrail();
    }

    createTrail() {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        this.scene.add(trail);
        return trail;
    }

    update() {
        this.age += 16.67;

        // Move projectile
        const movement = this.direction.clone().multiplyScalar(this.speed * 0.01667);
        this.position.add(movement);
        this.mesh.position.copy(this.position);
        this.glow.position.copy(this.position);

        // Add trail point
        this.trailPoints.push(this.position.clone());
        if (this.trailPoints.length > 50) {
            this.trailPoints.shift();
        }

        // Update trail
        const positions = new Float32Array(this.trailPoints.length * 3);
        this.trailPoints.forEach((point, i) => {
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        });

        const trailGeometry = new THREE.BufferGeometry();
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.trail.geometry = trailGeometry;

        // Remove if lifetime exceeded or out of bounds
        if (this.age > this.lifetime || this.position.length() > 1000) {
            this.shouldRemove = true;
        }
    }

    checkCollision(enemy) {
        const distance = this.position.distanceTo(enemy.position);
        return distance < (this.collisionRadius + 3);
    }

    dispose() {
        this.scene.remove(this.mesh);
        this.scene.remove(this.glow);
        this.scene.remove(this.trail);
    }
}
