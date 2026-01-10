# on_released-erase

**カテゴリ**: on_released | **優先度**: minimal | **代表例**: M JAMMING

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタンを離したときに指定範囲内のキャラクターを消去または無効化する |
| 詳細     | ボタンを押している間に範囲や効果を調整し、離した瞬間に範囲内の敵や障害物を消去したり、無効化したりする。押している時間によって消去範囲や効果が変化する場合がある |
| リスク   | 消去のタイミングや範囲を誤ると、敵を消去しきれなかったり、必要なオブジェクトまで消去してしまう。また、消去中は無防備になる場合がある |
| リワード | 適切なタイミングと範囲で消去することで、複数の敵を一度に倒したり、連鎖反応を誘発したりすることができる。連続成功でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-extend, weapon-explosion, rule-chain |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// m_jamming.js L80-117 より
// 長押しでジャミング範囲拡大、離すと範囲内のミサイルを反射
if (input.isJustPressed) {
  play("select");
}
if (input.isPressed || input.isJustReleased) {
  robot.radius *= 1 + 0.01 * sqrt(difficulty);  // 範囲拡大
  robot.vel.mul(0.9);  // 移動速度低下
  color("cyan");
} else {
  robot.radius = clamp(robot.radius + sqrt(difficulty) * 0.5, 0, 15);
  color("light_cyan");
}
arc(robot.pos, robot.radius, 2);  // ジャミング範囲表示

// ボタンを離すか範囲が最大に達したら発動
if (input.isJustReleased || robot.radius > 50) {
  play("laser");
  multiplier = 1;
  // 範囲内のミサイル数をカウント
  let mc = 0;
  missiles.forEach((m) => {
    if (m.pos.distanceTo(robot.pos) < robot.radius + 1 && m.explosionRadius < 0) {
      mc++;
    }
  });
  // 範囲内のミサイルを反射（向きを反転）
  missiles.forEach((m) => {
    if (m.pos.distanceTo(robot.pos) < robot.radius + 1 && m.explosionRadius < 0) {
      m.angle = robot.pos.angleTo(m.pos);  // 外向きに反転
      m.explosionRadius = clamp(mc * sqrt(mc), 1, 25);
      m.angleVel = 0;
      m.speed /= 2;
      addScore(multiplier, m.pos);
      multiplier++;
    }
  });
  robot.radius = mc;  // 範囲リセット
}
```

**参考**: `games/src/m_jamming.js`: L80-L117

## 使用例ゲーム

このタグを使用しているゲーム:

- M JAMMING (`games/description/m_jamming.md`) - 長押しでジャミング範囲拡大、離してミサイルを反射