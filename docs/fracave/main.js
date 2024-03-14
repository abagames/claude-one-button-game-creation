title = "FRACAVE";

description = `
[Hold]
 Accelerate
`;

options = {
  viewSize: { x: 100, y: 150 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

let player;
let walls;
let wallSpeed;
let wallInterval;

function update() {
  if (!ticks) {
    player = {
      pos: vec(40, 75),
      angle: 0,
      speed: 1,
      noReflectionDistance: 0,
    };
    walls = [
      ...generateFractalWall(20, 0, 20, 150, 3),
      ...generateFractalWall(80, 0, 80, 150, 3),
    ];
    wallSpeed = 1;
    wallInterval = 150;
  }

  // 壁の生成
  wallInterval += wallSpeed;
  if (wallInterval >= 150) {
    wallInterval = 0;
    const leftWalls = generateFractalWall(20, -150, 20, 0, 3);
    const rightWalls = generateFractalWall(80, -150, 80, 0, 3);
    walls.push(...leftWalls, ...rightWalls);
  }

  // プレイヤーの移動
  if (input.isJustPressed) {
    play("click");
  }
  if (input.isPressed) {
    player.speed += (2 - player.speed) * 0.3;
  } else {
    player.speed += (0.1 - player.speed) * 0.3;
  }
  player.pos.addWithAngle(player.angle, player.speed * difficulty);
  player.noReflectionDistance -= player.speed * difficulty;

  walls.forEach((wall) => {
    wall.y1 += wallSpeed;
    wall.y2 += wallSpeed;
  });

  color("cyan");
  bar(player.pos, 7, 3, player.angle);

  color("black");
  walls.forEach((wall) => {
    if (
      line(wall.x1, wall.y1, wall.x2, wall.y2).isColliding.rect.cyan &&
      player.noReflectionDistance < 0
    ) {
      const wallVector = vec(wall.x2 - wall.x1, wall.y2 - wall.y1);
      const wallNormal = vec(-wallVector.y, wallVector.x).normalize();

      const playerVector = vec(Math.cos(player.angle), Math.sin(player.angle));

      const dot = playerVector.x * wallNormal.x + playerVector.y * wallNormal.y;
      const reflectVector = vec(
        playerVector.x - 2 * dot * wallNormal.x,
        playerVector.y - 2 * dot * wallNormal.y
      );

      player.angle = Math.atan2(reflectVector.y, reflectVector.x);
      player.speed = 0.2;
      addScore(1, player.pos);
      player.pos.addWithAngle(player.angle, 7);
      play("hit");
      player.noReflectionDistance = 9;
    }
  });

  if (!player.pos.isInRect(0, 0, 100, 150)) {
    play("explosion");
    end();
  }

  wallSpeed = difficulty;

  walls = walls.filter((wall) => wall.y1 < 170);

  function generateFractalWall(x1, y1, x2, y2, depth) {
    if (depth === 0) {
      return [{ x1, y1, x2, y2 }];
    }
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const offsetX = rnds(10);
    const offsetY = rnds(5);
    return [
      ...generateFractalWall(x1, y1, midX + offsetX, midY + offsetY, depth - 1),
      ...generateFractalWall(midX + offsetX, midY + offsetY, x2, y2, depth - 1),
    ];
  }
}
