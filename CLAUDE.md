# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## PREREQUISITE FILES - READ BEFORE EXECUTION

- **Before Idea Generation**: Read all content in `cc_knowledge/one-button-game-design-guide.md`
- **Before Implementation**: Read all content in `cc_knowledge/one-button-game-implementation-guide.md` and `cc_knowledge/crisp-game-lib-guide.md`

## Project Overview

This is a comprehensive documentation project for one-button game design and implementation. The repository contains guides for:

- **Game Design**: Systematic 30-second idea generation using verb matrices and validation frameworks
- **Implementation**: Step-by-step development process from concept to playable game
- **Technical Reference**: Complete crisp-game-lib JavaScript library guide for LLM-assisted development

## Repository Structure

```
cc_knowledge/
├── one-button-game-design-guide.md         # Core design methodology
├── one-button-game-implementation-guide.md # Development workflow and templates
└── crisp-game-lib-guide.md                 # Technical JavaScript library documentation
```

## Content Architecture

### Design Framework

- **Verb Matrix System**: 30-second idea generation using combinations of basic verbs, transformation verbs, and world effects
- **Three-Layer Engagement**: Immediate understanding → Progressive discovery → Clear risk/reward
- **Seven Innovation Methods**: Systematic approaches for creating unique game mechanics
- **Validation Checklists**: Structured evaluation criteria for game concepts

### Implementation Process

- **Standardized Input Format**: Structured template for game concepts from design phase
- **Minimal Implementation**: Start with core mechanics, expand through playtesting
- **Target Platform**: JavaScript with HTML5 Canvas using crisp-game-lib
- **Progressive Development**: Three phases - Core → Enhancement → Polish
- **AI-Human Collaboration**: Structured workflow with clear role separation and communication protocols
- **Ambiguity Management**: Systematic approach to handling specification uncertainties during implementation

### Technical Stack

- **Primary Framework**: crisp-game-lib (functional JavaScript game library)
- **Development Approach**: LLM-assisted development with functional API design
- **Game Loop**: 60fps update cycle with integrated collision detection
- **Platform**: Browser-based with mobile-first responsive design

## Documentation Conventions

- **Structure**: Numbered chapters with clear subsections
- **Examples**: Code blocks, bullet points, emoji indicators (✅/❌)
- **Validation**: Checklists and before/after comparisons
- **Templates**: Standardized formats for idea generation and implementation planning

## Key Design Principles

- **One-Button Constraint**: All games must use single input method
- **30-Second Rule**: Core gameplay loop should be understandable within 30 seconds
- **Innovation Focus**: Each game should introduce novel mechanics not found in existing games
- **Systematic Validation**: Multiple checkpoint evaluations throughout design process
- **Platform-Agnostic Design**: Concepts applicable beyond JavaScript/crisp-game-lib

## Working with This Repository

When editing documentation:

1. Use guides as primary reference for Claude Code operations
2. Preserve numbered section structure and formatting
3. Ensure examples and checklists remain actionable
4. Validate cross-references between guides remain accurate

## Game Implementation Workflow

When implementing one-button games using the guides in this repository:

### Directory Structure for Game Implementation

Create games in the following structure:

```
tmp/games/[game-name]/
├── index.html          # Complete HTML file with crisp-game-lib integration
└── main.js            # Game logic implementation
```

### Implementation Steps

1. **Design Phase**: Use `cc_knowledge/one-button-game-design-guide.md` to generate and validate game concepts
2. **Development Phase**: Follow `cc_knowledge/one-button-game-implementation-guide.md` for structured development workflow
3. **Technical Implementation**: Reference `cc_knowledge/crisp-game-lib-guide.md` for library-specific implementation details
4. **File Creation**:
   - Create directory: `./tmp/games/[game-name]` (relative to project root)
   - Generate `index.html` with complete game setup
   - Implement `main.js` with game logic
   - Ensure games are immediately playable in browser

### Game Development Principles

- **Toy Experience**: Create safe experimentation environments without traditional game-over conditions
- **Recovery Systems**: Implement graceful failure handling and player recovery mechanisms
- **One-Button Focus**: Maintain single input constraint throughout development
- **Iterative Refinement**: Use playtesting to evolve from core mechanics to polished experiences
