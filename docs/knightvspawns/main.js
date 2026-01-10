title = `KNIGHT
  VS.
PAWNS
`;

description = `
[Tap] Move knight
`;

characters = [
  `
  ll
 llll
lllll
  lll

 lllll
  `,
  `
  ll
 llll
llllll
llllll
 llll
  ll
`,
  `
  ll
  ll
 
 llll
  ll
llllll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 2,
};

const G = {
  WIDTH: 100,
  HEIGHT: 100,
  BOARD_SIZE: 8,
  SQUARE_SIZE: 10,
};

// Define variables for objects
/** @type {{pos: Vector}} */
let knight;
/** @type {{pos: Vector, moveIndex: number}} */
let ghostKnight;
/** @type {{pos: Vector}[]} */
let pawns;

// Game state variables
let moveInterval;
let pawnInterval;
let spawnInterval;

// Constants
const VALID_MOVES = [
  { x: 1, y: -2 },
  { x: 2, y: -1 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
  { x: -1, y: 2 },
  { x: -2, y: 1 },
  { x: -2, y: -1 },
  { x: -1, y: -2 },
];

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    knight = { pos: vec(3, 7) };
    ghostKnight = { pos: vec(5, 6), moveIndex: 0 };
    pawns = [];
    moveInterval = 0;
    pawnInterval = 0;
    spawnInterval = 0;
  }

  // Draw chessboard
  for (let i = 0; i < G.BOARD_SIZE; i++) {
    for (let j = 0; j < G.BOARD_SIZE; j++) {
      color((i + j) % 2 === 0 ? "light_black" : "white");
      rect(
        i * G.SQUARE_SIZE + 10,
        j * G.SQUARE_SIZE + 10,
        G.SQUARE_SIZE,
        G.SQUARE_SIZE
      );
    }
  }

  // Update and draw knight
  moveInterval--;
  if (moveInterval <= 0) {
    moveGhostKnight();
    moveInterval = 30 / difficulty;
  }
  color("blue");
  char(
    "b",
    ghostKnight.pos.x * G.SQUARE_SIZE + 15,
    ghostKnight.pos.y * G.SQUARE_SIZE + 15
  );

  // Handle player input
  if (input.isJustPressed) {
    play("laser");
    knight.pos = vec(ghostKnight.pos);
    moveGhostKnight();
    addScore(
      G.BOARD_SIZE - knight.pos.y,
      knight.pos.x * G.SQUARE_SIZE + 15,
      knight.pos.y * G.SQUARE_SIZE + 15
    );
  }

  color("blue");
  char(
    "a",
    knight.pos.x * G.SQUARE_SIZE + 15,
    knight.pos.y * G.SQUARE_SIZE + 15
  );

  // Update and draw pawns
  pawnInterval--;
  if (pawnInterval <= 0) {
    movePawns();
    pawnInterval = 60 / difficulty;
  }

  // Spawn new pawns
  spawnInterval--;
  if (spawnInterval <= 0) {
    spawnPawn();
    spawnInterval = 120 / difficulty;
  }

  color("red");
  pawns.forEach((p) => {
    char("c", p.pos.x * G.SQUARE_SIZE + 15, p.pos.y * G.SQUARE_SIZE + 15);
  });

  // Check for collisions and game over condition
  pawns.forEach((p) => {
    if (p.pos.x === knight.pos.x && p.pos.y === knight.pos.y) {
      play("explosion");
      end();
    }
  });

  // Remove pawns that have reached the bottom
  remove(pawns, (p) => p.pos.y >= G.BOARD_SIZE);
}

// Helper functions
function isValidMove(pos) {
  return (
    pos.x >= 0 && pos.x < G.BOARD_SIZE && pos.y >= 0 && pos.y < G.BOARD_SIZE
  );
}

function moveGhostKnight() {
  let newPos;
  do {
    newPos = vec(knight.pos).add(VALID_MOVES[ghostKnight.moveIndex]);
    ghostKnight.moveIndex = (ghostKnight.moveIndex + 1) % VALID_MOVES.length;
  } while (!isValidMove(newPos));
  ghostKnight.pos = newPos;
}

function movePawns() {
  pawns.forEach((p) => {
    p.pos.y++;
  });
}

function spawnPawn() {
  const x = Math.floor(rnd(0, G.BOARD_SIZE));
  pawns.push({ pos: vec(x, 0) });
}
