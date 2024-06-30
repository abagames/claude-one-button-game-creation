title = "PERISCOPE PING";

description = `
[Hold] Ping
[Tap]  Fire & Turn
`;

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 7,
};

// Define variables for objects.
/** @type {{angle: number, pingRadius: number, angleVel: number}} */
let periscope;
/** @type {{pos: Vector}} */
let tower;
/** @type {{pos: Vector, isHidden: boolean, type: string, angle: number}[]} */
let objects;
/** @type {{pos: Vector, angle: number, speed: number}[]} */
let shots;

// Define variables for games.
const playAreaRadius = 50;
const periscopeRotationSpeed = 0.04;
const objectMoveSpeed = 0.1;
const shotSpeed = 1;
let spawnTimer = 0;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    periscope = { angle: 0, pingRadius: 0, angleVel: 1 };
    tower = { pos: vec(50, 50) };
    objects = [];
    shots = [];
  }

  // Implement the rules of the objects.

  // Draw play area boundary
  color("light_black");
  arc(tower.pos, playAreaRadius);

  // Periscope
  periscope.angle +=
    periscopeRotationSpeed * periscope.angleVel * sqrt(difficulty);
  let periscopePos = vec(tower.pos).add(
    vec(cos(periscope.angle) * 10, sin(periscope.angle) * 10)
  );

  color("blue");
  box(periscopePos, 3);

  if (input.isJustPressed) {
    play("laser");
    periscope.pingRadius = 0;
    periscope.angleVel *= -1;
    fireShot(periscopePos, periscope.angle);
  }

  if (input.isPressed) {
    periscope.pingRadius += 1;
    color("light_blue");
    arc(periscopePos, periscope.pingRadius, 5);
  }

  // Tower
  color("black");
  box(tower.pos, 10);

  // Shots
  remove(shots, (shot) => {
    shot.pos.addWithAngle(shot.angle, shot.speed * sqrt(difficulty));
    color("cyan");
    bar(shot.pos, 3, 3, shot.angle);

    // Check if shot is out of play area
    if (shot.pos.distanceTo(tower.pos) > playAreaRadius) {
      return true;
    }
  });

  // Objects
  remove(objects, (obj) => {
    obj.pos.addWithAngle(obj.angle, objectMoveSpeed * sqrt(difficulty));

    if (obj.pos.distanceTo(tower.pos) < 5) {
      // Object has reached the tower
      return true;
    } else {
      let c;
      color("transparent");
      if (obj.type === "circle") {
        c = arc(obj.pos, 2).isColliding.rect;
      } else {
        c = bar(obj.pos, 4, 4, (((ticks * 10) % 360) * PI) / 180, 0.5)
          .isColliding.rect;
      }
      if (c.cyan) {
        color("red");
        play("hit");
        particle(obj.pos, { count: 20, speed: 1 });
        addScore(floor(obj.pos.distanceTo(tower.pos)), obj.pos);
        return true;
      } else if (c.light_blue || c.blue || c.black) {
        color("red");
        if (obj.type === "circle") {
          arc(obj.pos, 2).isColliding.rect.red;
        } else {
          bar(obj.pos, 4, 4, (((ticks * 10) % 360) * PI) / 180, 0.5).isColliding
            .rect.red;
        }
        if (obj.isHidden) {
          play("coin");
          obj.isHidden = false;
        }
        if (c.blue || c.black) {
          play("explosion");
          end();
        }
      } else {
        obj.isHidden = true;
      }
    }
    return false;
  });

  // Spawn new objects
  spawnTimer += difficulty;
  if (objects.length === 0 || spawnTimer > 199) {
    spawnTimer = 0;
    spawnObject();
  }
}

function spawnObject() {
  let angle = rnd(0, PI * 2);
  let pos = vec(tower.pos).add(
    vec(cos(angle) * playAreaRadius, sin(angle) * playAreaRadius)
  );
  objects.push({
    pos: pos,
    isHidden: true,
    type: rnd() < 0.5 ? "circle" : "triangle",
    angle: angle + PI + rnds(0.5),
  });
}

function fireShot(pos, angle) {
  shots.push({
    pos: vec(pos),
    angle,
    speed: shotSpeed,
  });
}
