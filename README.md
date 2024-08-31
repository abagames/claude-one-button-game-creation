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
[![catchingwheel screenshot](./docs/catchingwheel/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?catchingwheel)
[![blockstacker screenshot](./docs/blockstacker/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?blockstacker)
[![sunflowersway screenshot](./docs/sunflowersway/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?sunflowersway)
[![bladedancer screenshot](./docs/bladedancer/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?bladedancer)
[![windpower screenshot](./docs/windpower/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?windpower)
[![rotationrod screenshot](./docs/rotationrod/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?rotationrod)
[![neonpollinator screenshot](./docs/neonpollinator/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?neonpollinator)
[![baserunnerdash screenshot](./docs/baserunnerdash/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?baserunnerdash)
[![fishgrill screenshot](./docs/fishgrill/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fishgrill)
[![elastichero screenshot](./docs/elastichero/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?elastichero)
[![stompingbubbles screenshot](./docs/stompingbubbles/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?stompingbubbles)
[![twinjumpers screenshot](./docs/twinjumpers/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?twinjumpers)
[![slimestretcher screenshot](./docs/slimestretcher/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?slimestretcher)
[![knightvspawns screenshot](./docs/knightvspawns/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?knightvspawns)
[![stageseparation screenshot](./docs/stageseparation/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?stageseparation)
[![windowwasher screenshot](./docs/windowwasher/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?windowwasher)
[![kelpclimber screenshot](./docs/kelpclimber/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?kelpclimber)
[![plasmasplitter screenshot](./docs/plasmasplitter/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?plasmasplitter)
[![pulsepiper screenshot](./docs/pulsepiper/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?pulsepiper)
[![tornadotwister screenshot](./docs/tornadotwister/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?tornadotwister)
[![zipfall screenshot](./docs/zipfall/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?zipfall)
[![periscopeping screenshot](./docs/periscopeping/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?periscopeping)
[![quantumleaper screenshot](./docs/quantumleaper/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?quantumleaper)
[![gravitywell screenshot](./docs/gravitywell/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?gravitywell)
[![rotatingtunnel screenshot](./docs/rotatingtunnel/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?rotatingtunnel)
[![monkeyt screenshot](./docs/monkeyt/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?monkeyt)
[![fracave screenshot](./docs/fracave/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fracave)
[![outpostpatrol screenshot](./docs/outpostpatrol/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?outpostpatrol)
[![cleaner screenshot](./docs/cleaner/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?cleaner)
[![turtletide screenshot](./docs/turtletide/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?turtletide)
[![hoardspout screenshot](./docs/hoardspout/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?hoardspout)
[![feedingfrenzy screenshot](./docs/feedingfrenzy/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?feedingfrenzy)
[![fallbounce screenshot](./docs/fallbounce/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?fallbounce)
<a href="https://abagames.github.io/claude-one-button-game-creation/?bridgecross"><img src="./docs/bridgecross/screenshot.gif" width="300px">
[![hoppinhazards screenshot](./docs/hoppinhazards/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?hoppinhazards)
[![jpaddle screenshot](./docs/jpaddle/screenshot.gif)](https://abagames.github.io/claude-one-button-game-creation/?jpaddle)

# Prompt

See [prompt.txt](./project_knowledge/prompt.txt)

By using the prompts in the [game_description_prompt directory](./game_description_prompt/), you can generate markdown files from the source code that explain the rules of the game and other information. The generated markdown files can be used as the project knowledge.

# Can AI Chatbots Create New Games?

Recent improvements in LLM performance have enabled them to handle many aspects of small game development. I wrote the article about the small game development process using chatbots.

- [Can AI Chatbots Create New Games?](https://abagames.github.io/joys-of-small-game-development-en/generation/can_ai_chatbot_create_game.html)
