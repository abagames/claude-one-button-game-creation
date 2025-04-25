# Claude's One-Button Game Creation

I used the AI chatbot [Claude](https://claude.ai/) to generate a one-button game using the [crisp-game-lib](https://github.com/abagames/crisp-game-lib) library. By providing appropriate prompts and files to [Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet), it can generate unique game ideas and create the corresponding game code in JavaScript.

# How to use

By dropping [set of 5 files in the chat_knowledge directory](./chat_knowledge/) into the chat session of Claude and starting a chat, game generation can be performed.

You can also give [files in the project_knowledge directory](./project_knowledge/) to [project knowledge](https://www.anthropic.com/news/projects) for use.

First, enter the theme of the game you want to create. If necessary, type 'proceed' to proceed to the next step.

# Examples of Built Games

Click the image below to play directly in the browser.

[![wavybird screenshot](./docs/wavybird/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?wavybird)
[![catchingwheel screenshot](./docs/catchingwheel/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?catchingwheel)
[![grapplingh screenshot](./docs/grapplingh/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?grapplingh)
[![fracave screenshot](./docs/fracave/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fracave)
[![blockstacker screenshot](./docs/blockstacker/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?blockstacker)
[![sunflowersway screenshot](./docs/sunflowersway/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?sunflowersway)
[![skyraftsman screenshot](./docs/skyraftsman/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?skyraftsman)
[![neonpollinator screenshot](./docs/neonpollinator/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?neonpollinator)

[TROJAN DEFENSE](https://abagames.github.io/claude-one-button-game-creation/?trojan-defense) /
[LEVITATION](https://abagames.github.io/claude-one-button-game-creation/?levitation) /
[TURBO TUNNEL](https://abagames.github.io/claude-one-button-game-creation/?turbotunnel) /
[VINE CLIMBER](https://abagames.github.io/claude-one-button-game-creation/?vineclimber) /
[BLADE DANCER](https://abagames.github.io/claude-one-button-game-creation/?bladedancer) /
[WIND POWER](https://abagames.github.io/claude-one-button-game-creation/?windpower) /
[ROTATION ROD](https://abagames.github.io/claude-one-button-game-creation/?rotationrod) /
[BASERUNNER DASH](https://abagames.github.io/claude-one-button-game-creation/?baserunnerdash) /
[FISH GRILL](https://abagames.github.io/claude-one-button-game-creation/?fishgrill) /
[ELASTIC HERO](https://abagames.github.io/claude-one-button-game-creation/?elastichero) /
[STOMPING BUBBLES](https://abagames.github.io/claude-one-button-game-creation/?stompingbubbles) /
[TWIN JUMPERS](https://abagames.github.io/claude-one-button-game-creation/?twinjumpers) /
[SLIME STRETCHER](https://abagames.github.io/claude-one-button-game-creation/?slimestretcher) /
[KNIGHT SPAWNS](https://abagames.github.io/claude-one-button-game-creation/?knightvspawns) /
[STAGE SEPARATION](https://abagames.github.io/claude-one-button-game-creation/?stageseparation)

The game code is in [the docs directory](./docs/).

# Prompt

See [prompt.txt](./project_knowledge/prompt.txt).

For prompts for Cursor's agent mode, see [cursor_knowledge/prompt.txt](./cursor_knowledge/prompt.md). This prompt contains a mechanism for simulation-based concept selection, realized in [ChatCraftClick](https://github.com/abagames/chat-craft-click).

By using the prompts in the [game_description_prompt directory](./game_description_prompt/), you can generate markdown files from the source code that explain the rules of the game and other information. The generated markdown files can be used as the project knowledge.

# Can AI Chatbots Create New Games?

Recent improvements in LLM performance have enabled them to handle many aspects of small game development. I wrote the article about the small game development process using chatbots.

- [Can AI Chatbots Create New Games?](https://abagames.github.io/joys-of-small-game-development-en/generation/can_ai_chatbot_create_game.html)

Using generative AI, you can create both images and sounds for games.

- [Creating Mini-Games in the Age of Generative AI - Generating Ideas, Code, Graphics, and Sound](https://dev.to/abagames/creating-mini-games-in-the-age-of-generative-ai-generating-ideas-code-graphics-and-sound-424k)
