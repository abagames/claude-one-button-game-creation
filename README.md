# Claude's One-Button Game Creation

I used the AI chatbot [Claude](https://claude.ai/) to generate a one-button game using the [crisp-game-lib](https://github.com/abagames/crisp-game-lib) library. By providing appropriate prompts and files to [Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet), it can generate unique game ideas and create the corresponding game code in JavaScript.

# How to use

By dropping [set of 5 files in the chat_knowledge directory](./chat_knowledge/) into the chat session of Claude and starting a chat, game generation can be performed.

You can also give [files in the project_knowledge directory](./project_knowledge/) to [project knowledge](https://www.anthropic.com/news/projects) for use.

First, enter the theme of the game you want to create. If necessary, type 'proceed' to proceed to the next step.

# Examples of Built Games

Click the image below to play directly in the browser.

[![grapplingh screenshot](./docs/grapplingh/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?grapplingh)
[![wavybird screenshot](./docs/wavybird/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?wavybird)
[![skyraftsman screenshot](./docs/skyraftsman/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?skyraftsman)
[![fishgrill screenshot](./docs/fishgrill/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fishgrill)
[![catchingwheel screenshot](./docs/catchingwheel/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?catchingwheel)
[![windowwasher screenshot](./docs/windowwasher/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?windowwasher)
[![kelpclimber screenshot](./docs/kelpclimber/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?kelpclimber)
[![pulsepiper screenshot](./docs/pulsepiper/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?pulsepiper)
[![tornadotwister screenshot](./docs/tornadotwister/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?tornadotwister)
[![elastichero screenshot](./docs/elastichero/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?elastichero)
[![zipfall screenshot](./docs/zipfall/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?zipfall)
[![periscopeping screenshot](./docs/periscopeping/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?periscopeping)
[![quantumleaper screenshot](./docs/quantumleaper/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?quantumleaper)
[![stompingbubbles screenshot](./docs/stompingbubbles/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?stompingbubbles)
[![gravitywell screenshot](./docs/gravitywell/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?gravitywell)
[![bladedancer screenshot](./docs/bladedancer/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?bladedancer)
[![rotatingtunnel screenshot](./docs/rotatingtunnel/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?rotatingtunnel)
[![twinjumpers screenshot](./docs/twinjumpers/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?twinjumpers)
[![slimestretcher screenshot](./docs/slimestretcher/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?slimestretcher)
[![jugglingact screenshot](./docs/jugglingact/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?jugglingact)
[![outpostpatrol screenshot](./docs/outpostpatrol/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?outpostpatrol)
[![monkeyt screenshot](./docs/monkeyt/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?monkeyt)
[![fracave screenshot](./docs/fracave/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fracave)
[![cleaner screenshot](./docs/cleaner/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?cleaner)
[![windpower screenshot](./docs/windpower/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?windpower)
[![turtletide screenshot](./docs/turtletide/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?turtletide)
[![hoardspout screenshot](./docs/hoardspout/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?hoardspout)
[![feedingfrenzy screenshot](./docs/feedingfrenzy/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?feedingfrenzy)
[![fallbounce screenshot](./docs/fallbounce/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fallbounce)
[![hoppinhazards screenshot](./docs/hoppinhazards/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?hoppinhazards)
<a href="https://abagames.github.io/claude-one-button-game-creation/?bridgecross"><img src="./docs/bridgecross/screenshot.gif" width="300px">
[![jpaddle screenshot](./docs/jpaddle/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?jpaddle)

# Prompt

See [prompt.txt](./chat_knowledge/prompt.txt)

By using the prompts in the [game_description_prompt directory](./game_description_prompt/), you can generate markdown files from the source code that explain the rules of the game and other information. The generated markdown files can be used as the project knowledge.

# Generative Reroll Game Development

LLMs like Claude can now generate simple games. While often flawed, occasional gems emerge. By iterating and refining LLM outputs, developers can create unique, playable games—a process called Generative Reroll Game Development.

- [Generative Reroll Game Development Using LLMs](https://dev.to/abagames/generative-reroll-game-development-using-llms-22m3)
