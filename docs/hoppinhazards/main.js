title = `
Hoppin' 
Hazards
`;

description = `
[Hold] Hop
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 6,
};

// オブジェクトの変数を定義
// 蛙:
// - プロパティ: 座標、サイズ
/** @type {{pos: Vector, size: number}} */
let frog;
const minFrogSize = 10; // 蛙の最小サイズ
const maxFrogSize = 30; // 蛙の最大サイズ

// 障害物:
// - プロパティ: 座標、落下スピード
/** @type {{pos: Vector, vx: number, vy: number, shape: string, color: Color}[]} */
let obstacles;
const obstacleSpeed = 1; // 障害物の初期スピード

// ゲームの変数を定義
/** @type {number} */
let nextObstacleTicks;

function update() {
  if (!ticks) {
    // ゲームの初期状態をセット
    // 蛙:
    // - 初期状態: 画面下部中央に配置。最小サイズ。
    frog = { pos: vec(50, 90), size: minFrogSize };

    // 障害物:
    // - 初期状態: 空の配列
    obstacles = [];

    // 全変数を初期化
    nextObstacleTicks = 0;
  }

  color("blue");
  rect(0, 95, 100, 5);

  // 蛙:
  // - 形状: 丸
  // - 色: 緑
  // - 一ボタン操作: ボタンを押している間、サイズが大きくなりながら上方向に移動。最大サイズまで膨らむと移動を止める。
  //                ボタンを離すと、元のサイズに戻りながら下方向に移動。
  // - 振る舞い: 常に画面下部中央に水平方向の位置を固定。
  // - 衝突イベント: 鳥やヘビなどの障害物と接触するとゲームオーバー。
  frog.pos.x = 50;

  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    frog.size = Math.min(frog.size + difficulty, maxFrogSize);
    frog.pos.y = Math.max(frog.pos.y - difficulty, 10);
  } else {
    frog.size = Math.max(frog.size - difficulty * 2, minFrogSize);
    frog.pos.y = Math.min(frog.pos.y + difficulty * 2, 90);
  }
  addScore((frog.size - minFrogSize) / 100);

  color("green");
  box(frog.pos, frog.size);

  // 障害物:
  // - 形状: 鳥は三角形、ヘビは曲線など
  // - 色: 鳥は青、ヘビは赤など
  // - 出現ルール: 一定時間ごとに画面左右のランダムな位置に出現。
  // - 振る舞い: 画面中央に向かって等速で移動。画面中央を通り過ぎると消える。
  // - 移動スピード: 時間経過とともに徐々に速くなる。

  nextObstacleTicks -= difficulty;
  if (nextObstacleTicks < 0) {
    const x = rndi(2) === 0 ? -10 : 110;
    const shape = rndi(2) === 0 ? "bird" : "snake";
    let newObstacle = {
      pos: vec(x, rnd(10, 90)), // 画面左右のランダムな位置
      vx:
        x < 50
          ? obstacleSpeed + rnd(difficulty - 1)
          : -(obstacleSpeed + rnd(difficulty - 1)), // 画面中央に向かう速度
      vy: 0,
      shape,
      color: rndi(2) === 0 ? "blue" : "red",
    };
    // @ts-ignore
    obstacles.push(newObstacle);
    play(shape === "bird" ? "hit" : "click");
    nextObstacleTicks = rnd(45, 120) / sqrt(difficulty);
  }

  remove(obstacles, (o) => {
    // 振る舞い
    o.pos.add(o.vx, o.vy);

    // 衝突判定
    color(o.color);
    if (o.shape === "bird") {
      let cob = bar(o.pos, 10, 3, o.vx > 0 ? 0 : PI, 0.5).isColliding.rect;
      if (cob.green) {
        play("explosion");
        end();
      }
    } else if (o.shape === "snake") {
      let cob = arc(o.pos, 5, 3, PI / 2, PI / 2 + (o.vx > 0 ? -PI : PI))
        .isColliding.rect;
      if (cob.green) {
        play("explosion");
        end();
      }
    }

    return o.pos.x < -10 || o.pos.x > 110; // 画面外に出たら消去
  });
}
