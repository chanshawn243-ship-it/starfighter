# TIE Defender - Space Combat Game

An interactive 3D space combat game built with Three.js, featuring a detailed TIE Defender starfighter and engaging combat mechanics.

## Features

✨ **Detailed TIE Defender Model**
- Accurate hexagonal solar panels
- Detailed cockpit and fuselage
- Engine glow effects
- Shield generator visualization
- Weapon hardpoints (cannons & missiles)

🎮 **Gameplay**
- Single-player target practice mode
- 8+ enemy fighters with AI pathfinding
- Real-time health bars for enemies
- Projectile trail effects
- Boost mechanic (SPACE)

🌌 **Visuals**
- Dynamic starfield background
- Advanced lighting with shadows
- HDR tone mapping
- Glowing engine effects
- Real-time combat HUD

⌨️ **Controls**
- **WASD** - Move
- **Q/E** - Move up/down
- **MOUSE** - Look around
- **CLICK** - Fire weapons
- **SPACE** - Speed boost
- **P** - Pause/Resume

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The game will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Deploy to Netlify

### Option 1: Using Netlify CLI

```bash
npm install -g netlify-cli
npm run deploy
```

### Option 2: Connect GitHub Repository

1. Push this repository to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command to: `npm run build`
6. Set publish directory to: `dist`
7. Deploy!

## Game Mechanics

### Combat System
- Fire projectiles at enemies
- Track accuracy and kill count
- Real-time threat assessment
- Distance indicator for nearest target

### AI Enemies
- Autonomous flight patterns
- Smart pathfinding
- Look-at player mechanics
- Progressive difficulty

### Stats Tracking
- Kills eliminated
- Accuracy percentage
- Shield integrity
- Threat level monitoring

## File Structure

```
├── src/
│   ├── main.js              # Application entry point
│   ├── models/
│   │   └── TIEDefender.js   # Detailed starfighter model
│   ├── game/
│   │   ├── GameScene.js     # Main game logic
│   │   ├── Enemy.js         # AI enemy class
│   │   ├── Projectile.js    # Weapon projectiles
│   │   └── StarField.js     # Background environment
│   ├── controllers/
│   │   └── InputController.js # Player input handling
│   └── ui/
│       └── HUDManager.js    # HUD and UI updates
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js           # Build configuration
└── netlify.toml             # Netlify deployment config
```

## Performance

- Optimized for 60 FPS gameplay
- Efficient enemy management
- Projectile pooling for performance
- Shadow map optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires WebGL 2.0 support

## Future Enhancements

- [ ] Multiple starfighter variants
- [ ] Advanced weapon types (missiles, cluster bombs)
- [ ] Dynamic difficulty scaling
- [ ] Leaderboard system
- [ ] Sound effects and music
- [ ] Particle effects
- [ ] Space stations and terrain

## License

MIT License - Feel free to modify and distribute

## Author

Created with Three.js and Vite
