import * as THREE from 'three';

export class TIEDefender extends THREE.Group {
    constructor() {
        super();
        this.createTIEDefender();
        this.position.set(0, 5, 0);
        this.scale.set(2, 2, 2);
    }

    createTIEDefender() {
        // Main cockpit/fuselage (center sphere with hexagonal prism extension)
        const cockpitGeom = new THREE.SphereGeometry(0.5, 32, 32);
        const cockpitMat = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 100,
            emissive: 0x111111
        });
        const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.add(cockpit);

        // Hexagonal wing panel details on cockpit
        this.addCockpitDetails(cockpit);

        // Extended fuselage behind cockpit
        const fuselageGeom = new THREE.BoxGeometry(0.4, 0.4, 2);
        const fuselageMat = new THREE.MeshPhongMaterial({ 
            color: 0x222222,
            shininess: 80,
            emissive: 0x0a0a0a
        });
        const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat);
        fuselage.position.z = -1.2;
        fuselage.castShadow = true;
        fuselage.receiveShadow = true;
        this.add(fuselage);

        // Twin solar panel wings (signature TIE design)
        this.addWings();

        // Engine glow panels
        this.addEngineGlow();

        // Weapon hardpoints
        this.addWeaponHardpoints();

        // Shield generator details
        this.addShieldGeneratorDetails();

        // Cockpit window (transparent)
        const windowGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x001144,
            metalness: 0.3,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6,
            emissive: 0x0033ff,
            emissiveIntensity: 0.3
        });
        const window = new THREE.Mesh(windowGeom, windowMat);
        window.position.z = 0.1;
        window.scale.set(0.9, 0.9, 0.5);
        this.add(window);
    }

    addCockpitDetails(cockpit) {
        // Hexagonal panel grid on cockpit
        const panelMat = new THREE.MeshPhongMaterial({
            color: 0x1a1a1a,
            shininess: 60,
            emissive: 0x220000
        });

        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const panelGeom = new THREE.BoxGeometry(0.15, 0.4, 0.05);
            const panel = new THREE.Mesh(panelGeom, panelMat);
            panel.position.x = Math.cos(angle) * 0.45;
            panel.position.y = Math.sin(angle) * 0.45;
            panel.rotation.z = angle;
            panel.castShadow = true;
            this.add(panel);
        }
    }

    addWings() {
        // Left solar panel array
        const wingLeft = new THREE.Group();
        this.createSolarPanel(wingLeft, -3.5, 0, 0);
        this.add(wingLeft);

        // Right solar panel array
        const wingRight = new THREE.Group();
        this.createSolarPanel(wingRight, 3.5, 0, 0);
        this.add(wingRight);

        // Top solar panel array
        const wingTop = new THREE.Group();
        this.createSolarPanel(wingTop, 0, 3.5, Math.PI / 2);
        this.add(wingTop);

        // Bottom solar panel array
        const wingBottom = new THREE.Group();
        this.createSolarPanel(wingBottom, 0, -3.5, Math.PI / 2);
        this.add(wingBottom);
    }

    createSolarPanel(group, x, y, rotation) {
        const panelMat = new THREE.MeshPhongMaterial({
            color: 0x0a0a0a,
            shininess: 40,
            emissive: 0x1a1a1a
        });

        // Main solar panel frame
        const frameGeom = new THREE.BoxGeometry(2.2, 2.2, 0.1);
        const frame = new THREE.Mesh(frameGeom, panelMat);
        frame.position.set(x, y, 0);
        frame.rotation.z = rotation;
        frame.castShadow = true;
        frame.receiveShadow = true;
        group.add(frame);

        // Solar cell grid (hexagonal pattern)
        const cellMat = new THREE.MeshPhongMaterial({
            color: 0x111111,
            shininess: 80,
            emissive: 0x333333
        });

        for (let i = -4; i <= 4; i++) {
            for (let j = -4; j <= 4; j++) {
                if ((i + j) % 2 === 0) {
                    const cellGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 6);
                    const cell = new THREE.Mesh(cellGeom, cellMat);
                    cell.position.set(
                        x + i * 0.4,
                        y + j * 0.4,
                        0.08
                    );
                    cell.rotation.x = Math.PI / 2;
                    cell.rotation.z = rotation;
                    cell.castShadow = true;
                    group.add(cell);
                }
            }
        }

        // Panel edge details
        const edgeMat = new THREE.MeshPhongMaterial({
            color: 0x444444,
            shininess: 100,
            emissive: 0x222222
        });

        const edgeGeom = new THREE.BoxGeometry(2.4, 0.1, 0.08);
        const edges = [
            new THREE.Mesh(edgeGeom, edgeMat),
            new THREE.Mesh(edgeGeom, edgeMat),
            new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.08), edgeMat),
            new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.08), edgeMat)
        ];

        edges[0].position.set(x, y + 1.15, 0.15);
        edges[1].position.set(x, y - 1.15, 0.15);
        edges[2].position.set(x + 1.15, y, 0.15);
        edges[3].position.set(x - 1.15, y, 0.15);

        edges.forEach(edge => {
            edge.rotation.z = rotation;
            edge.castShadow = true;
            group.add(edge);
        });
    }

    addEngineGlow() {
        const engineMat = new THREE.MeshPhongMaterial({
            color: 0xff4400,
            emissive: 0xff2200,
            emissiveIntensity: 0.8
        });

        // Main engine glow at rear
        const engineGeom = new THREE.CylinderGeometry(0.4, 0.35, 0.3, 16);
        const engine = new THREE.Mesh(engineGeom, engineMat);
        engine.position.z = -2.5;
        engine.castShadow = true;
        this.add(engine);

        // Engine glow light
        const engineLight = new THREE.PointLight(0xff6644, 1, 50);
        engineLight.position.z = -2.5;
        this.add(engineLight);
    }

    addWeaponHardpoints() {
        const weaponMat = new THREE.MeshPhongMaterial({
            color: 0x555555,
            shininess: 120,
            emissive: 0x111111
        });

        // Left cannon
        const cannon1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
            weaponMat
        );
        cannon1.position.set(-0.8, 0.3, 0.2);
        cannon1.rotation.z = Math.PI / 6;
        cannon1.castShadow = true;
        this.add(cannon1);

        // Right cannon
        const cannon2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
            weaponMat
        );
        cannon2.position.set(0.8, 0.3, 0.2);
        cannon2.rotation.z = -Math.PI / 6;
        cannon2.castShadow = true;
        this.add(cannon2);

        // Missile pod indicators
        const missileMat = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess: 60,
            emissive: 0x440000
        });

        for (let i = 0; i < 4; i++) {
            const missile = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.15, 0.4),
                missileMat
            );
            missile.position.set(
                (i % 2 === 0 ? -1 : 1) * 2.5,
                (i < 2 ? 1 : -1) * 2.5,
                0
            );
            missile.castShadow = true;
            this.add(missile);
        }
    }

    addShieldGeneratorDetails() {
        const shieldMat = new THREE.MeshPhongMaterial({
            color: 0x0066ff,
            shininess: 80,
            emissive: 0x003388,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });

        // Shield generator rings
        for (let i = 1; i <= 3; i++) {
            const ringGeom = new THREE.TorusGeometry(0.8 * i, 0.08, 8, 100);
            const ring = new THREE.Mesh(ringGeom, shieldMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.3;
            ring.castShadow = true;
            this.add(ring);
        }
    }

    updateGlow(intensity) {
        this.children.forEach(child => {
            if (child instanceof THREE.Light) {
                child.intensity = intensity;
            } else if (child.material && child.material.emissive) {
                child.material.emissiveIntensity = intensity * 0.8;
            }
        });
    }
}
