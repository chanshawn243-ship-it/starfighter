export class HUDManager {
    constructor() {
        this.threatLevel = 'NONE';
    }

    update(gameScene) {
        const stats = gameScene.getStats();

        // Update HUD elements
        document.getElementById('killCount').textContent = stats.kills;
        document.getElementById('accuracy').textContent = stats.accuracy;
        document.getElementById('distance').textContent = stats.nearestEnemyDistance;
        document.getElementById('shield').textContent = Math.round(stats.shield);

        // Threat level based on nearest enemy
        if (stats.nearestEnemyDistance < 30) {
            this.threatLevel = 'CRITICAL';
        } else if (stats.nearestEnemyDistance < 60) {
            this.threatLevel = 'HIGH';
        } else if (stats.nearestEnemyDistance < 120) {
            this.threatLevel = 'MEDIUM';
        } else {
            this.threatLevel = 'LOW';
        }

        document.getElementById('threatLevel').textContent = this.threatLevel;
    }
}
