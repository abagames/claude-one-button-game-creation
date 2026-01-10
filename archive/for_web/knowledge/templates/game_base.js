import "crisp-game-lib";

const title = "TEMPLATE";

const description = `
[Press] TODO
`;

const characters = [];

const options = {};

// State placeholders reused by scaffolded prototypes.
let state;

function update() {
  if (!ticks) {
    // TODO: initialize state based on selected tags
    state = {};
  }

  // TODO: implement tag-driven mechanics inside update()
}

// @ts-ignore
init({ title, description, characters, options, update });
