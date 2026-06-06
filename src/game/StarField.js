import * as THREE from 'three';

export class StarField {
    constructor(scene, count = 1000, distance = 5000) {
        this.scene = scene;
        this.distance = distance;
        this.createStars(count);
    }

    createStars(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            positions[idx] = (Math.random() - 0.5) * this.distance * 2;
            positions[idx + 1] = (Math.random() - 0.5) * this.distance * 2;
            positions[idx + 2] = (Math.random() - 0.5) * this.distance * 2;

            // Star colors (white, blue, and yellow)
            const starColor = Math.random();
            if (starColor > 0.8) {
                colors[idx] = 0.3 + Math.random() * 0.7;     // R
                colors[idx + 1] = 0.3 + Math.random() * 0.7; // G
                colors[idx + 2] = 1;                          // B
            } else if (starColor > 0.6) {
                colors[idx] = 1;                  // R
                colors[idx + 1] = 0.8;            // G
                colors[idx + 2] = 0.3;            // B
            } else {
                colors[idx] = 1;                  // R
                colors[idx + 1] = 1;              // G
                colors[idx + 2] = 1;              // B
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            sRGBColorSpace: true
        });

        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
    }
}
