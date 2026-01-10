# Claude's One-Button Game Creation

**English** | [日本語](./README_ja.md)

See [GAMES.md](./GAMES.md) for a complete gallery of all one-button games created for this project.

For documentation and guides from the previous version, see [archive/README.md](./archive/README.md).

**🎮 Mobile-First Game Development Workflow**

Develop Core Game Mechanics on Your Smartphone, Polish on PC

A browser game development project using TypeScript and [crisp-game-lib](https://github.com/abagames/crisp-game-lib), designed for mobile-first prototyping and development workflow.

## Overview

This project demonstrates a **mobile-first game development workflow** where you can:

- **Design and Code on Mobile**: Use [Claude Code on the web](https://www.claude.com/blog/claude-code-on-the-web) to design and implement core game mechanics through conversational AI
- **Instant Mobile Testing**: [Netlify](https://www.netlify.com/) branch deploys provide immediate preview URLs for real device testing
- **Automated Validation**: Scripts handle quality checks, novelty metrics, and balance validation
- **PC Polish (Recommended)**: Final balance tuning and refinement on PC for production-ready games

Perfect for:

- Prototyping game ideas during commute time
- Implementing base mechanics on the go
- Learning game development concepts without initial PC setup
- Mobile-first development workflow experimentation

## Mobile Development Experience

### Why Mobile-First Development Works

**Claude Code + Netlify + GitHub = Efficient Prototyping Workflow**

Mobile devices are not ideal for lengthy, detailed technical discussions. This project addresses this limitation through extensive automation for the core implementation phase:

1. **AI-Driven Design & Implementation**: Claude Code autonomously handles game mechanics design, code generation, and quality validation based on minimal input
2. **Automated Validation Pipeline**: Scripts automatically verify code quality, novelty metrics, balance parameters, and similarity checks - no manual intervention needed
3. **Branch-Based Testing**: Each commit triggers automatic Netlify deployment with a unique mobile-accessible URL
4. **No Terminal Required**: All commands run through Claude Code's integrated tools
5. **Touch-Optimized Games**: crisp-game-lib's one-button mechanics are perfect for mobile play

**Key Automation Features:**

- Tag selection and constraint verification (`npm run generate-constraints`)
- Novelty scoring and similarity detection (`npm run similarity-check`)
- Game balance tuning via genetic algorithms (`npm run balance-game`)
- Comprehensive quality evaluation (`npm run verify-prototype`)
- One-command deployment (`npm run build:game`)

This means you can implement playable game prototypes on mobile by simply approving automated tag selections and providing brief feedback at checkpoints. The system handles the complex work of designing mechanics, implementing code, and validating quality. Final balance tuning on PC is recommended for production-quality games.

### Typical Mobile Development Session

```
You: "Start new game development" (on mobile browser)
  ↓
Phase 0: Automated tag selection via npm run generate-constraints
         → Tags proposed: player:glide, obstacle:rotating, rule:gravity
  ↓
You: "Approved" (or "Change obstacle:rotating to obstacle:static")
  ↓
Phase 1: Claude Code designs mechanics from approved tags
         → Problem structure: "Navigate gravity fields while gliding"
  ↓
You: "Approved" (minimal input required)
  ↓
Phase 2: Novelty check & visual communication design
  ↓
You: "Approved" (or minor feedback)
  ↓
Phase 3: Implementation in dev/main.ts + similarity check (<70%)
  ↓
Claude Code: Commit & push to branch
  ↓
Netlify: Automatic deployment → preview URL
  ↓
You: Test on smartphone → "Too easy, add more obstacles"
  ↓
Phase 4: Claude Code runs validation & applies adjustments
  ↓
Repeat Phase 3-4 with minimal feedback until base mechanics are solid
  ↓
Phase 5: Create pull request, merge to main
  ↓
PC (optional but recommended): Final balance tuning and polish
  ↓
Copy to docs/ → Build → Publish to GitHub Pages
```

**Note:** The mobile development workflow focuses on implementing core game mechanics through conversational AI. While the base implementation can be completed entirely on mobile devices, final balance tuning and polish are typically done on PC for higher quality results. The automated scripts (tag selection, novelty checking, similarity detection, balance validation) minimize the back-and-forth conversation needed on mobile, making it practical to develop playable game prototypes on smartphones where typing long messages is impractical.

## Project Structure

```
.
├── dev/                  # Development directory (Netlify base)
│   ├── index.html       # Game entry point for development
│   └── main.ts          # Game logic (implement here)
├── docs/                # GitHub Pages directory
│   ├── index.html       # Game collection page
│   └── [game-slug]/     # Published games
│       ├── index.html
│       ├── main.ts
│       └── dist/        # Built game assets
├── reference/           # Tag and game metadata
│   ├── tags.csv
│   └── games.csv
├── knowledge/           # Code snippets and guides
│   ├── tag_code_map.json
│   └── crisp-game-lib-guide.md
├── scripts/             # Validation and build scripts
├── netlify.toml         # Netlify configuration
└── vite.config.ts       # Vite configuration
```

## Development Workflow

This project follows a structured 6-phase workflow for game development. For detailed workflow documentation, see `CLAUDE.md` (`AGENTS.md`) and `game_generation_workflow.md`.

### Quick Start: Developing a New Game

1. **Design Phase**: Select tags, verify constraints, and design the game concept
2. **Implementation**: Work in the `dev/` directory (`dev/index.html` + `dev/main.ts`)
3. **Validation**: Run verification scripts to ensure quality and novelty
4. **Testing**: Commit and push to a branch - Netlify automatically deploys for mobile testing
5. **Publication**: Copy to `docs/[game-slug]/` and build for GitHub Pages
6. **Cleanup**: Empty `dev/` directory for the next game

### Detailed Workflow (6 Phases)

**Phase 0: Tag Selection and Initial Validation**

- Review `reference/tags.csv` and `reference/games.csv`
- Run `npm run generate-constraints` for tag validation
- Calculate novelty score

**Phase 1: Problem-Solution Structuring**

- Design game mechanics with one-button constraint
- Define core problem and solution

**Phase 2: Creative Synthesis and Novelty Assurance**

- Verify differentiation from existing games
- Run `npm run similarity-check` (must be <70%)
- Design visual communication

**Phase 3: Prototype in dev/**

- Implement in `dev/main.ts`
- Follow TypeScript + crisp-game-lib structure
- Verify with `npx tsc --noEmit dev/main.ts`

**Phase 4: Validation and Balance Tuning**

- Run `npm run verify-prototype -- --slug dev --file dev/main.ts --mode lint`
- GA diagnosis and balance tuning if needed

**Phase 5: Final Validation and Publication**

- Comprehensive evaluation: `npm run verify-prototype -- --slug dev --file dev/main.ts --mode full`
- Copy to `docs/[game-slug]/`
- Build: `npm run build:game -- --game [game-slug]`
- Update `docs/index.html` with new game link
- Clean `dev/` directory

### Publishing to GitHub Pages

1. Complete all 6 phases of validation
2. Copy game files: `cp dev/index.html docs/[game-slug]/` and `cp dev/main.ts docs/[game-slug]/`
3. Build the game: `npm run build:game -- --game [game-slug]`
4. Add game link to `docs/index.html`
5. Commit and push to master
6. Clean dev directory: `rm -rf dev/*`
7. Game is live on GitHub Pages

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (dev/ directory)
npm run dev

# Build for Netlify testing (dev/dist/)
npm run build:dev

# Build individual game for GitHub Pages
npm run build:game -- --game [game-slug]

# Preview production build
npm run preview
```

## Available Scripts

### Development

- `npm run dev` - Start Vite dev server for the `dev/` directory
- `npm run build:dev` - Build dev game for Netlify (outputs to `dev/dist/`)

### Validation and Quality

- `npm run verify-prototype -- --slug dev --file dev/main.ts --mode [lint|sim|ga|full]` - Comprehensive game validation
- `npm run similarity-check -- --file dev/main.ts` - Check similarity with existing games
- `npm run check-style -- --file dev/main.ts` - Verify code style compliance
- `npm run simulate-game -- --file dev/main.ts` - Run game simulation

### Balance and Metrics

- `npm run balance-game -- --slug dev` - Co-evolutionary balance tuning
- `npm run calculate-novelty -- --slug dev` - Calculate novelty metrics
- `npm run calculate-quality -- --slug dev` - Calculate quality scores

### Tag and Constraint Management

- `npm run generate-constraints` - Generate cross-category constraint recommendations
- `npm run fetch-tag-snippets` - Fetch code snippets for selected tags

### Publishing

- `npm run build:game -- --game [game-slug]` - Build individual game to `docs/[game-slug]/dist/`
- `npm run generate-metadata -- --slug [game-slug]` - Generate game metadata

## Netlify Setup

1. Connect your GitHub repository to Netlify
2. Netlify will use settings from `netlify.toml`:
   - Base directory: `dev/`
   - Build command: `npm run build:dev`
   - Publish directory: `dev/dist`
3. Enable branch deploys for automatic preview deployments
4. Each branch push will create a unique preview URL

## GitHub Pages Setup

1. Complete game development in `dev/` directory
2. Copy game to `docs/[game-slug]/`
3. Build the game: `npm run build:game -- --game [game-slug]`
4. Update `docs/index.html` to add link to the new game
5. Commit the `docs/` directory and push to GitHub
6. Enable GitHub Pages in repository settings (source: `docs/` folder)
7. Your games will be available at `https://[username].github.io/[repo-name]/`

## About crisp-game-lib

crisp-game-lib is a minimalist JavaScript library for creating browser-based arcade-style games. It provides:

- Simple pixel-based graphics
- Easy input handling
- Built-in physics and collision detection
- Score tracking and game state management
