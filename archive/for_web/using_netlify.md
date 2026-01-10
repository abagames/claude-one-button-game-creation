# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Run development server (serves dev/ directory)
npm run dev

# Build for Netlify testing (outputs to dev/dist/)
npm run build:dev

# Build for GitHub Pages (outputs to docs/)
npm run build

# Preview production build
npm run preview
```

### TypeScript
This project uses TypeScript with strict mode enabled. Run `tsc` to check types (configured with `noEmit: true`).

## Architecture

### Dual-Build System
This project has a unique dual-build configuration designed for mobile development workflow:

1. **Development/Netlify Build (dev/ directory)**
   - Root: `dev/`
   - Output: `dev/dist/`
   - Base URL: `/`
   - Command: `npm run build:dev`
   - Used for: Branch deploys on Netlify for mobile testing

2. **Production/GitHub Pages Build (root directory)**
   - Root: `.` (project root)
   - Output: `docs/`
   - Base URL: `/web-coding-agent-game-dev/`
   - Command: `npm run build`
   - Used for: Publishing completed games to GitHub Pages

**Key Configuration:** `vite.config.ts` uses mode detection to switch between these two build targets. The `BUILD_MODE=dev` environment variable or `mode === 'development'` triggers dev build; otherwise, production build is used.

### Game Development Structure

Games are built using **crisp-game-lib**, a minimalist library for arcade-style browser games. All games follow this pattern:

**Game Entry Point (main.ts):**
```typescript
import "crisp-game-lib";

const title = "GAME_NAME";
const description = `[Control] Action`;
const characters: string[] = []; // Optional ASCII art sprites
const options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
  theme: "dark" | "simple" | "pixel" | "shapeDark" | "crt"
};

function update() {
  // Game loop runs every frame
  // Use global variables: ticks, input, difficulty
}

// @ts-ignore
init({ options, title, description, characters, update });
```

**crisp-game-lib Global API:**
- `ticks`: Frame counter (0 on first frame, use `!ticks` for initialization)
- `input.isJustPressed`: True when tap/click just started
- `input.isPressed`: True while tap/click is held
- `difficulty`: Increases over time
- Drawing: `color()`, `box()`, `rect()`, `line()`, `text()`, `char()`
- Audio: `play("select" | "coin" | "explosion" | "powerUp" | "hit" | "jump" | "random")`
- Game: `addScore()`, `end()`, `vec()`, `rnd()`
- Collision: All draw functions return objects with `.isColliding` property
- Utilities: `remove(array, callback)` for array iteration with removal

### Workflow: Dev → Production

**Developing a new game:**
1. Create a new branch
2. Edit `dev/main.ts` and `dev/index.html`
3. Test locally with `npm run dev`
4. Push branch → Netlify creates preview URL for mobile testing
5. Create Pull Request when game is complete

**Publishing completed game to GitHub Pages:**
1. Create `docs/[game-name]/` directory
2. Copy `dev/main.ts` to `docs/[game-name]/main.ts`
3. Copy `dev/index.html` to `docs/[game-name]/index.html` (update title as needed)
4. Build the game:
   ```bash
   npm run build:game -- --game [game-name]
   ```
   This creates `docs/[game-name]/dist/` with the built game
5. Update `docs/index.html` to add game card link:
   ```html
   <a href="[game-name]/dist/index.html" class="game-card">
     <h2>GAME TITLE</h2>
     <p>Game description</p>
   </a>
   ```
6. Commit all changes (including `docs/`) and push to master
7. Game is live on GitHub Pages at `/web-coding-agent-game-dev/[game-name]/dist/`

**Build Script Details:**
- `npm run build:game -- --game <name>`: Builds a specific game in `docs/<name>/`
- Uses relative base path (`./`) for compatibility with both local testing and GitHub Pages
- Output: `docs/<name>/dist/` directory with `index.html` and `assets/`
- Source files (`main.ts`, `index.html`) remain in `docs/<name>/` for reference

**Important:**
- `docs/` contains both source code (TypeScript) and build output (`dist/` subdirectories)
- Always rebuild after modifying game source: `npm run build:game -- --game <name>`
- The `dist/` folders are auto-generated; edit source files instead

### HTML Structure

**dev/index.html:** Single game entry point
- Loads sounds-some-sounds from CDN (required for crisp-game-lib audio)
- Loads `main.ts` as module

**index.html:** Game collection page (root)
- Grid layout displaying game cards
- Each card links to a game in `games/[game-name]/index.html`

### Netlify Configuration

`netlify.toml` configures:
- Base directory: `dev/`
- Build command: `npm run build:dev`
- Publish directory: `dev/dist`
- Node version: 20 (required for Vite 7)
- SPA redirect: All routes → `/index.html`
- Branch deploys enabled for preview URLs

## TypeScript Configuration

- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode enabled with unused variable/parameter checks
- `@ts-ignore` is used on `init()` calls because crisp-game-lib types are incomplete
