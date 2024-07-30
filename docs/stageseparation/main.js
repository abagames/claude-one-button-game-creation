title = "STAGE SEPARATION";

description = `
[Tap] Staging
`;

options = {
  viewSize: { x: 100, y: 150 },
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 5,
};

// Define variables for objects.
/** @type {{ pos: Vector, vel: Vector, currentStage: number, stageHeight: number, stageBurnTime: number }} */
let rocket;
/** @type {{ pos: Vector, size: number, vel: Vector }[]} */
let debris;
/** @type {{ skyColor: Color, starDensity: number }} */
let background;
/** @type {{ x: number, y: number }[]} */
let stars;
/** @type {{ pos: Vector, vel: Vector, height: number }[]} */
let separatedStages;

// Define variables for the game.
let nextDebrisSpawn;
let cameraY;
let zoom;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    rocket = {
      pos: vec(50, 90),
      vel: vec(0, -0.5),
      currentStage: 4,
      stageHeight: 10,
      stageBurnTime: 100,
    };
    debris = [];
    separatedStages = [];
    background = {
      skyColor: "light_blue",
      starDensity: 0,
    };
    stars = times(200, () => ({
      x: rnd(-200, 300),
      y: rnd(-1000, 0),
    }));
    nextDebrisSpawn = 99;
    cameraY = 0;
    zoom = 1;
  }

  // Update altitude
  const altitude = -rocket.pos.y;
  addScore(-rocket.vel.y * 0.1);

  // Update camera position and zoom
  const targetCameraY = rocket.pos.y - 130 * zoom;
  cameraY += clamp((targetCameraY - cameraY) * 0.1, -99, 0);
  zoom = clamp(1 + altitude / 9999, 1, 3);

  // Draw stars
  color("black");
  stars.forEach((star) => {
    const screenX = (star.x - 50) / zoom + 50;
    const screenY = ((star.y - cameraY) % 1000) / zoom;
    if (screenX >= 0 && screenX <= 100 && screenY >= 0 && screenY <= 150) {
      box(screenX, screenY, 1);
    }
  });

  // Update and draw rocket
  rocket.vel.y -= 0.1 * (rocket.stageBurnTime / 60);
  rocket.vel.y += 0.05;
  rocket.pos.y += rocket.vel.y * difficulty;

  if (rocket.stageBurnTime > 0) {
    rocket.stageBurnTime -= difficulty;
  }

  if (input.isJustPressed && rocket.currentStage > 2) {
    play("click");
    separatedStages.push({
      pos: vec(
        rocket.pos.x,
        rocket.pos.y + rocket.stageHeight * (rocket.currentStage - 1)
      ),
      vel: vec(rnds(0.5), rocket.vel.y + 0.5),
      height: rocket.stageHeight,
    });
    rocket.currentStage--;
    rocket.vel.y -= 0.5;
    rocket.stageBurnTime = 60;
  }
  rocket.currentStage = clamp(rocket.currentStage + 0.02 * difficulty, 0, 4);

  color(rocket.currentStage > 2 ? "red" : "light_red");
  const rocketScreenPos = worldToScreen(rocket.pos);
  rect(
    rocketScreenPos.x - 5 / zoom,
    rocketScreenPos.y,
    10 / zoom,
    (rocket.stageHeight * rocket.currentStage) / zoom
  );
  if (rocket.stageBurnTime > 0) {
    particle(
      rocketScreenPos.x,
      rocketScreenPos.y + (rocket.stageHeight * rocket.currentStage) / zoom,
      {
        count: 1,
        speed: rocket.stageBurnTime / 20 / zoom,
        angle: PI / 2,
        angleWidth: 0.3,
      }
    );
  }
  if (rocketScreenPos.y > 150) {
    play("explosion");
    end();
  }

  // Update and draw separated stages
  color("purple");
  remove(separatedStages, (stage) => {
    stage.vel.y += 0.1; // Gravity
    stage.pos.add(stage.vel);
    const stageScreenPos = worldToScreen(stage.pos);
    rect(
      stageScreenPos.x - 5 / zoom,
      stageScreenPos.y,
      10 / zoom,
      stage.height / zoom
    );
    return stage.pos.y > cameraY + 200 * zoom;
  });

  // Update and draw debris
  nextDebrisSpawn += rocket.vel.y * difficulty;
  if (nextDebrisSpawn < 0) {
    const side = rndi(0, 2);
    const spawnX = side ? 50 + 70 * zoom : 50 - 70 * zoom;
    debris.push({
      pos: vec(spawnX, cameraY - rnd(0, 200 * zoom)),
      size: rnd(5, 15),
      vel: vec((side ? -1 : 1) * rnd(0.5, 0.8), rnd(-15, 0)).mul(zoom / 2),
    });
    nextDebrisSpawn = rnd(120, 160) / sqrt(zoom);
  }

  color("light_black");
  remove(debris, (d) => {
    d.pos.add(vec(d.vel).mul(difficulty));
    const debrisScreenPos = worldToScreen(d.pos);
    const debrisCollision = arc(
      debrisScreenPos.x,
      debrisScreenPos.y,
      d.size / zoom
    ).isColliding.rect;
    if (debrisCollision.red || debrisCollision.light_red) {
      play("explosion");
      end();
      return false;
    }
    return d.pos.x < 50 - 70 * zoom || d.pos.x > 50 + 70 * zoom;
  });
}

// Helper function to convert world coordinates to screen coordinates
function worldToScreen(pos) {
  return {
    x: (pos.x - 50) / zoom + 50,
    y: (pos.y - cameraY) / zoom,
  };
}
