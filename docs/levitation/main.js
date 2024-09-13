title = "LEVITATION";

description = `
[Tap] Levitate / Fall
`;

characters = [
  `
 lll
ll ll  
ll ll  
ll ll  
ll ll  
ll lll
`,
  `
 llll
ll  ll
ll  ll
ll  ll
ll  ll
 llll
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 8,
};

/** @type {{ pos: Vector, vel: Vector, state: "crawl" | "roll" }} */
let caterpillar;

/** @type {{ pos: Vector, width: number }[]} */
let platforms;
let nextPlatformDist;
let multiplier;

function update() {
  if (!ticks) {
    caterpillar = { pos: vec(40, 40), vel: vec(1, 0), state: "crawl" };
    platforms = [{ pos: vec(0, 60), width: 99 }];
    nextPlatformDist = 0;
    multiplier = 1;
  }

  // Handle input for state switching
  if (input.isJustPressed) {
    play("select");
    caterpillar.state = caterpillar.state === "crawl" ? "roll" : "crawl";
    multiplier = 1;
  }

  // Update caterpillar position and state
  if (caterpillar.state === "crawl") {
    caterpillar.vel.x = -0.4 * difficulty;
    caterpillar.vel.y = 0;
  } else {
    caterpillar.vel.x = 0.2 * difficulty;
    caterpillar.vel.y += 0.2 * sqrt(difficulty);
  }
  caterpillar.vel.y *= 0.99;
  caterpillar.pos.add(caterpillar.vel);
  if (caterpillar.pos.y < 0 && caterpillar.vel.y < 0) {
    caterpillar.pos.y = 0;
    caterpillar.vel.y *= -0.3;
  }

  // Scroll the screen
  const scrollSpeed = difficulty * 0.5;

  nextPlatformDist -= scrollSpeed;
  if (nextPlatformDist < 0) {
    const width = rnd(30, 50);
    platforms.push({
      pos: vec(100, rnd(30, 90)),
      width,
    });
    nextPlatformDist = width + rnd(9);
  }

  // Check for reaching the cocoon or falling off screen
  if (
    caterpillar.pos.y > 100 ||
    caterpillar.pos.x < -3 ||
    caterpillar.pos.x > 103
  ) {
    play("explosion");
    end();
  }

  // Draw game objects
  color("green");
  const caterpillarShape = caterpillar.state === "crawl" ? "b" : "a";
  char(caterpillarShape, caterpillar.pos);

  color("light_black");
  remove(platforms, (p) => {
    if (rect(p.pos, p.width, 5).isColliding.char.a && caterpillar.vel.y >= 0) {
      play("jump");
      addScore(multiplier, caterpillar.pos);
      multiplier++;
      caterpillar.pos.y = p.pos.y - 3;
      caterpillar.vel.y *= -1.5;
    }
    p.pos.x -= scrollSpeed;
    return p.pos.x + p.width < 0;
  });
}
