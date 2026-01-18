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
let trails;

function update() {
  if (!ticks) {
    player = vec(50, 50);
    enemies = [];
    laserAngle = 0;
    laserSpeed = 0.04;
    spawnTimer = 0;
    combo = 1;
    trails = [];
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
      scaleY: 1.3,
      rotation: rnd(PI * 2),
    });
    // Spawn particle effect
    color("light_cyan");
    particle(vec(ex, ey), {
      count: 3,
      speed: 1,
      angle: angle + PI,
      angleWidth: PI / 2,
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
        particle(e.pos, { count: 15, speed: 2.5, angle: 0, angleWidth: PI });
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

  // Draw player with subtle breathing animation
  let breathScale = 1 + Math.sin(ticks * 0.1) * 0.05;
  color("cyan");
  box(player, 5 * breathScale, 5 * breathScale);
  // Player eyes looking at laser direction
  color("black");
  let eyeOffsetX = Math.cos(laserAngle) * 1.2;
  let eyeOffsetY = Math.sin(laserAngle) * 1.2;
  box(player.x - 1 + eyeOffsetX * 0.5, player.y + eyeOffsetY * 0.5, 1, 1);
  box(player.x + 1 + eyeOffsetX * 0.5, player.y + eyeOffsetY * 0.5, 1, 1);

  // Draw laser with afterimage
  color("light_yellow");
  let laserLen = 60;
  let lx = player.x + Math.cos(laserAngle) * laserLen;
  let ly = player.y + Math.sin(laserAngle) * laserLen;
  // Laser afterimage
  if (input.isPressed) {
    let prevAngle = laserAngle - laserSpeed * sqrt(difficulty) * 0.5;
    let plx = player.x + Math.cos(prevAngle) * laserLen * 0.9;
    let ply = player.y + Math.sin(prevAngle) * laserLen * 0.9;
    line(player, vec(plx, ply), 1);
  }
  color("yellow");
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
          if (!e.marked) {
            play("click");
            // Mark particle effect
            color("yellow");
            particle(e.pos, { count: 3, speed: 0.5, angle: 0, angleWidth: PI });
          }
          e.marked = true;
          e.scaleY = 0.7; // Squash when marked
        }
      }
    });
  }

  // Update and draw trails
  trails = trails.filter((t) => {
    t.life -= 1;
    if (t.life <= 0) return false;
    let alpha = t.life / t.maxLife;
    color(t.isSquare ? "light_purple" : "light_red");
    let size = t.size * alpha;
    if (t.isSquare) {
      box(t.pos, size);
    } else {
      // Triangle trail
      let s = size * 0.5;
      line(vec(t.pos.x, t.pos.y - s), vec(t.pos.x - s, t.pos.y + s), 1);
      line(vec(t.pos.x - s, t.pos.y + s), vec(t.pos.x + s, t.pos.y + s), 1);
      line(vec(t.pos.x + s, t.pos.y + s), vec(t.pos.x, t.pos.y - s), 1);
    }
    return true;
  });

  enemies.forEach((e) => {
    // Add trail for fast enemies
    let speed = Math.sqrt(e.vel.x * e.vel.x + e.vel.y * e.vel.y);
    if (speed > 0.3 && ticks % 3 === 0) {
      trails.push({
        pos: vec(e.pos.x, e.pos.y),
        life: 10,
        maxLife: 10,
        size: e.isSquare ? 6 : 6,
        isSquare: e.isSquare,
      });
    }

    e.pos.x += e.vel.x;
    e.pos.y += e.vel.y;

    // Dynamic rotation based on velocity
    e.rotation += speed * 0.15;

    // Squash & stretch animation - return to normal
    e.scaleY += (1 - e.scaleY) * 0.1;
  });

  enemies.forEach((e) => {
    color(e.marked ? "yellow" : e.isSquare ? "purple" : "red");
    let hitPlayer;
    let scaleX = 2 - e.scaleY; // Inverse for stretch effect

    if (e.isSquare) {
      // Rotating square with squash/stretch
      let halfW = 3 * scaleX;
      let halfH = 3 * e.scaleY;
      let corners = [
        vec(-halfW, -halfH),
        vec(halfW, -halfH),
        vec(halfW, halfH),
        vec(-halfW, halfH),
      ];
      // Rotate corners
      corners = corners.map((c) => {
        let rx = c.x * Math.cos(e.rotation) - c.y * Math.sin(e.rotation);
        let ry = c.x * Math.sin(e.rotation) + c.y * Math.cos(e.rotation);
        return vec(e.pos.x + rx, e.pos.y + ry);
      });
      // Draw rotated square
      line(corners[0], corners[1], 2);
      line(corners[1], corners[2], 2);
      line(corners[2], corners[3], 2);
      line(corners[3], corners[0], 2);
      // Collision check with box
      hitPlayer = box(e.pos, 6 * scaleX, 6 * e.scaleY).isColliding.rect.cyan;

      // Eyes for square - looking toward player
      color(e.marked ? "red" : "black");
      let eyeAngle = Math.atan2(player.y - e.pos.y, player.x - e.pos.x);
      let eyeDist = 1;
      let pupilX = Math.cos(eyeAngle) * eyeDist;
      let pupilY = Math.sin(eyeAngle) * eyeDist;
      box(e.pos.x - 1.5 + pupilX * 0.5, e.pos.y + pupilY * 0.5, 1, 1);
      box(e.pos.x + 1.5 + pupilX * 0.5, e.pos.y + pupilY * 0.5, 1, 1);
    } else {
      // Triangle with squash/stretch
      let h = 3 * e.scaleY;
      let w = 3 * scaleX;
      line(vec(e.pos.x, e.pos.y - h), vec(e.pos.x - w, e.pos.y + h), 2);
      line(vec(e.pos.x - w, e.pos.y + h), vec(e.pos.x + w, e.pos.y + h), 2);
      line(vec(e.pos.x + w, e.pos.y + h), vec(e.pos.x, e.pos.y - h), 2);
      hitPlayer = box(e.pos, 6 * scaleX, 6 * e.scaleY).isColliding.rect.cyan;

      // Eye for triangle - single eye looking toward player
      color(e.marked ? "red" : "black");
      let eyeAngle = Math.atan2(player.y - e.pos.y, player.x - e.pos.x);
      let pupilX = Math.cos(eyeAngle) * 0.8;
      let pupilY = Math.sin(eyeAngle) * 0.8;
      box(e.pos.x + pupilX, e.pos.y + pupilY, 1.5, 1.5);
    }
    if (hitPlayer) {
      play("explosion");
      color("red");
      particle(player, { count: 20, speed: 3, angle: 0, angleWidth: PI });
      end();
    }
  });

  enemies = enemies.filter(
    (e) => e.pos.x > -10 && e.pos.x < 110 && e.pos.y > -10 && e.pos.y < 110,
  );

  color("black");
  text(`x${combo}`, 3, 9, { isSmallText: true });
}
