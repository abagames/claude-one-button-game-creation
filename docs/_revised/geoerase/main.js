title = "GEOERASE";

description = `
[Hold] Mark
[Release] Erase
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 7,
};

let player;
let enemies;
let laserAngle;
let laserSpeed;
let spawnTimer;
let combo;
let markedEnemies;

function update() {
  if (!ticks) {
    player = vec(50, 50);
    enemies = [];
    laserAngle = 0;
    laserSpeed = 0.04;
    spawnTimer = 0;
    combo = 1;
    markedEnemies = [];
  }

  let spawnInterval = Math.max(20, 60 / difficulty);
  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnTimer = spawnInterval;
    let side = floor(rnd(4));
    let ex, ey;
    if (side === 0) {
      ex = rnd(100);
      ey = -5;
    } else if (side === 1) {
      ex = rnd(100);
      ey = 105;
    } else if (side === 2) {
      ex = -5;
      ey = rnd(100);
    } else {
      ex = 105;
      ey = rnd(100);
    }
    let isSquare = rnd() < 0.3;
    let speed = (isSquare ? 0.4 : 0.25) * sqrt(difficulty);
    let angle = Math.atan2(player.y - ey, player.x - ex);
    enemies.push({
      pos: vec(ex, ey),
      vel: vec(Math.cos(angle) * speed, Math.sin(angle) * speed),
      isSquare: isSquare,
      marked: false,
    });
  }

  laserAngle += laserSpeed * (input.isPressed ? 1 : 2) * sqrt(difficulty);

  if (input.isJustReleased) {
    let eraseCount = 0;
    enemies = enemies.filter((e) => {
      if (e.marked) {
        let pts = e.isSquare ? 2 : 1;
        addScore(pts * combo);
        color("yellow");
        particle(e.pos, 10);
        play("laser");
        eraseCount++;
        return false;
      }
      return true;
    });
    if (eraseCount > 1) {
      combo = Math.min(combo + eraseCount - 1, 16);
    } else {
      combo = Math.max(1, combo - 1);
    }
    enemies.forEach((e) => (e.marked = false));
  }

  color("cyan");
  box(player, 5);

  color("yellow");
  let laserLen = 60;
  let lx = player.x + Math.cos(laserAngle) * laserLen;
  let ly = player.y + Math.sin(laserAngle) * laserLen;
  line(player, vec(lx, ly), input.isPressed ? 2 : 1);

  if (input.isPressed) {
    enemies.forEach((e) => {
      let dx = e.pos.x - player.x;
      let dy = e.pos.y - player.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < laserLen && dist > 3) {
        let enemyAngle = Math.atan2(dy, dx);
        let angleDiff = Math.abs(enemyAngle - laserAngle);
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        angleDiff = Math.abs(angleDiff);
        if (angleDiff < 0.2) {
          play("click");
          e.marked = true;
        }
      }
    });
  }

  enemies.forEach((e) => {
    e.pos.x += e.vel.x;
    e.pos.y += e.vel.y;
  });

  enemies.forEach((e) => {
    color(e.marked ? "yellow" : e.isSquare ? "purple" : "red");
    let hitPlayer;
    if (e.isSquare) {
      hitPlayer = box(e.pos, 6).isColliding.rect.cyan;
    } else {
      hitPlayer = char("a", e.pos).isColliding.rect.cyan;
      color(e.marked ? "yellow" : "red");
      line(vec(e.pos.x, e.pos.y - 3), vec(e.pos.x - 3, e.pos.y + 3), 1);
      line(vec(e.pos.x - 3, e.pos.y + 3), vec(e.pos.x + 3, e.pos.y + 3), 1);
      line(vec(e.pos.x + 3, e.pos.y + 3), vec(e.pos.x, e.pos.y - 3), 1);
    }
    if (hitPlayer) {
      play("explosion");
      end();
    }
  });

  enemies = enemies.filter(
    (e) => e.pos.x > -10 && e.pos.x < 110 && e.pos.y > -10 && e.pos.y < 110
  );

  color("black");
  text(`x${combo}`, 3, 9, { isSmallText: true });
}
