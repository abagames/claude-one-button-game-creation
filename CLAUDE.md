# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## PREREQUISITE FILES - READ BEFORE EXECUTION

- **Before Idea Generation**: Read all content in `cc_knowledge/one-button-game-design-guide.md`
- **Before Implementation**: Read all content in `cc_knowledge/one-button-game-implementation-guide.md` and `cc_knowledge/crisp-game-lib-guide.md`

## Project Overview

This is a comprehensive documentation project for one-button game design and implementation through strategic human-LLM collaboration. The repository contains guides for:

- **Game Design**: 5-phase systematic workflow for designing fun, understandable, and innovative games
- **Implementation**: Human-LLM collaborative development process from concept to playable game
- **Technical Reference**: Complete crisp-game-lib JavaScript library guide for LLM-assisted development

## Repository Structure

```
cc_knowledge/
├── one-button-game-design-guide.md         # 5-phase collaborative design methodology
├── one-button-game-implementation-guide.md # 3-phase collaborative development workflow
└── crisp-game-lib-guide.md                 # Technical JavaScript library documentation
```

## Content Architecture

### Design Framework (Human-LLM Collaborative)

- **5-Phase Workflow**: Theme Inspiration → Problem-Solution Design → SCAMPER Innovation → Experience Integration → Final Validation
- **Strategic Collaboration**: LLM autonomous processing (70%) + Human validation checkpoints (30%)
- **Problem-First Approach**: Start with player problems, not "interesting mechanics"
- **SCAMPER-Enhanced Innovation**: Early creativity application with 3-second rule validation
- **Conceptual Walkthrough**: Logical validation replacing impossible simulation
- **User Feedback Integration**: Multiple validation options with human judgment

### Implementation Process (Human-LLM Collaborative)

- **Standardized Input Format**: Structured template for game concepts from design phase
- **3-Phase Progressive Development**: Minimal Implementation → Core Mechanics → Final Polish
- **Feedback-Driven Adjustment**: Single implementation → Experience feedback → Targeted adjustments
- **Universal Execution Protocol**: Consistent LLM auto-execute → Human validate → LLM adjust cycle
- **Ambiguity Detection System**: Systematic question management and assumption clarification
- **Experience-First Validation**: Human play-testing drives all parameter decisions

### Technical Stack

- **Primary Framework**: crisp-game-lib (functional JavaScript game library)
- **Development Approach**: LLM-assisted development with functional API design
- **Game Loop**: 60fps update cycle with integrated collision detection
- **Platform**: Browser-based with mobile-first responsive design
- **Coding Requirements**: Functional design only, no classes, global state management

## Human-LLM Collaboration Protocol

### Design Phase Collaboration (45-60 minutes total)

**Essential Human Checkpoints:**
1. **Phase 1**: Problem definition and solution logic validation
2. **Phase 2**: Innovation complexity check
3. **Phase 3**: Experience walkthrough approval
4. **Phase 4**: Implementation readiness confirmation

**Collaboration Execution:**
- 🤖 **LLM AUTO-EXECUTE**: Template completion, constraint checking, systematic processing
- 🤝 **HUMAN CHECKPOINT**: Problem clarity, solution logic, complexity assessment, final validation
- 🚫 **FORBIDDEN**: Starting with "interesting mechanics" before problem definition
- ✅ **REQUIRED**: Problem → Solution → Innovation → Experience → Implementation flow

### Implementation Phase Collaboration (30-45 minutes total)

**Universal Execution Protocol (All Phases):**
- 🤖 **LLM AUTO**: Implementation/Enhancement → Present for testing
- 🤝 **HUMAN**: Experience feedback → Specific adjustment requests
- 🤖 **LLM AUTO**: Parameter adjustment → Next cycle preparation
- 🚫 **FORBIDDEN**: Multiple implementation options, complex parameter choices
- ✅ **REQUIRED**: Single implementation → Feedback → Adjustment → Validation flow

**Essential Human Checkpoints:**
1. **Phase 1**: Basic functionality and reachability validation
2. **Phase 2**: Core mechanics understanding and balance feedback
3. **Phase 3**: Final experience evaluation and completion approval

## Key Design Principles

- **One-Button Constraint**: All games must use single input method (Press/Hold/Release combinations)
- **3-Second Rule**: Core gameplay mechanics should be understandable within 3 seconds
- **Problem-Solution Foundation**: Every game starts with a clear player problem and solution logic
- **Innovation Through SCAMPER**: Apply creativity methods early in design process
- **Physical Phenomenon Grounding**: Innovation based on intuitive physical concepts
- **Human Experience Validation**: All design decisions validated through human play-testing

## Working with This Repository

When editing documentation:

1. Use guides as primary reference for Claude Code operations
2. Preserve numbered section structure and formatting
3. Maintain human-LLM collaboration protocols
4. Ensure examples and checklists remain actionable
5. Validate cross-references between guides remain accurate

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

1. **Design Phase**: Use `cc_knowledge/one-button-game-design-guide.md` for 5-phase collaborative design workflow
2. **Development Phase**: Follow `cc_knowledge/one-button-game-implementation-guide.md` for 3-phase collaborative implementation
3. **Technical Implementation**: Reference `cc_knowledge/crisp-game-lib-guide.md` for library-specific implementation details
4. **File Creation**:
   - Create directory: `./tmp/games/[game-name]` (relative to project root)
   - Generate `index.html` with complete game setup
   - Implement `main.js` with game logic
   - Ensure games are immediately playable in browser

### Game Development Principles

- **Problem-First Design**: Always start with player problems, not mechanics
- **Collaborative Validation**: Use human checkpoints for all critical decisions
- **Feedback-Driven Implementation**: Adjust based on human play experience
- **One-Button Focus**: Maintain single input constraint throughout development
- **Iterative Refinement**: Use structured feedback cycles to evolve from core mechanics to polished experiences
- **Experience Optimization**: Prioritize player understanding and engagement over technical complexity

## Collaboration Guidelines

### For LLM Autonomous Work
- Complete template-based tasks systematically
- Apply constraint checking automatically
- Execute parameter adjustments based on human feedback
- Present single implementations for validation

### For Human Validation Points
- Confirm problem-solution logic makes sense
- Validate complexity levels and understanding
- Provide specific play experience feedback
- Guide final design decisions

### Expected Outcomes
- **Higher Success Rate**: Early validation prevents late-stage redesigns
- **Clearer Designs**: Human intuition catches ambiguity LLM might miss
- **Better Innovation**: Human judgment prevents innovation for its own sake
- **Implementable Results**: Human validation ensures practical feasibility
- **Efficient Development**: Optimized time allocation between human and LLM work
