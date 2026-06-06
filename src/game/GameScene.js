import * as THREE from 'three';
import { Enemy } from './Enemy.js';
import { StarField } from './StarField.js';
import { Projectile } from './Projectile.js';

export class GameScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.enemies = [];
        this.projectiles = [];
        this.targetMarkers = [];
        this.shootCooldown = 0;
        this.maxShootCooldown = 100; // milliseconds between shots
        this.gameActive = false;
        this.stats = {
            kills: 0,
            shots: 0,
            hits: 0,
            shield: 100,
            maxShield: 100
        };

        this.initEnvironment();
    }

    initEnvironment() {
        // Create star field
        this.starField = new StarField(this.scene, 1000, 5000);

        // Create initial enemies
        this.spawnEnemyWaves();
    }

    spawnEnemyWaves() {
        // Spawn 8 enemies in a circle around the player
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const distance = 100 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = (Math.random() - 0.5) * 30;

            const enemy = new Enemy(
                { x, y, z },
                this.scene,
                this.camera
            );
            this.enemies.push(enemy);
        }
    }

    start() {
        this.gameActive = true;
        this.stats.kills = 0;
        this.stats.shots = 0;
        this.stats.hits = 0;
        this.stats.shield = 100;
    }

    reset() {
        this.gameActive = false;
        this.enemies.forEach(enemy => enemy.dispose());
        this.enemies = [];
        this.projectiles = [];
        this.targetMarkers = [];
        this.spawnEnemyWaves();
    }

    update(inputController) {
        if (!this.gameActive) return;

        // Update cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= 16.67; // ~60fps
        }

        // Handle player input
        if (inputController.isMouseDown && this.shootCooldown <= 0) {
            this.fireProjectile(inputController);
            this.shootCooldown = this.maxShootCooldown;
            this.stats.shots++;
        }

        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.camera.position);

            // Remove dead enemies
            if (enemy.health <= 0) {
                enemy.dispose();
                this.enemies.splice(index, 1);
                this.stats.kills++;

                // Spawn replacement
                if (this.enemies.length < 5) {
                    this.spawnEnemyWaves();
                }
            }
        });

        // Update projectiles
        this.projectiles.forEach((projectile, index) => {
            projectile.update();

            if (projectile.shouldRemove) {
                projectile.dispose();
                this.projectiles.splice(index, 1);
                return;
            }

            // Check collision with enemies
            this.enemies.forEach(enemy => {
                if (projectile.checkCollision(enemy)) {
                    enemy.takeDamage(projectile.damage);
                    projectile.shouldRemove = true;
                    this.stats.hits++;
                }
            });
        });
    }

    fireProjectile(inputController) {
        // Fire from camera position in camera forward direction
        const projectile = new Projectile(
            this.camera.position.clone(),
            this.camera.getWorldDirection(new THREE.Vector3()),
            this.scene
        );
        this.projectiles.push(projectile);
    }

    getStats() {
        return {
            kills: this.stats.kills,
            shots: this.stats.shots,
            hits: this.stats.hits,
            accuracy: this.stats.shots > 0 
                ? Math.round((this.stats.hits / this.stats.shots) * 100) 
                : 0,
            shield: this.stats.shield,
            nearestEnemyDistance: this.getNearestEnemyDistance()
        };
    }

    getNearestEnemyDistance() {
        if (this.enemies.length === 0) return 0;

        let nearest = Infinity;
        this.enemies.forEach(enemy => {
            const dist = this.camera.position.distanceTo(enemy.position);
            if (dist < nearest) {
                nearest = dist;
            }
        });
        return Math.round(nearest);
    }
}
