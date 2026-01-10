# rule-pass_through_gap

**カテゴリ**: rule | **優先度**: low | **代表例**: INTERSPACE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 隙間を通り抜ける。狭い隙間にプレイヤーキャラクターを素早く動かして fit させる。 |
| 詳細     | プレイヤーは壁や障害物の隙間を通過する必要があり、タイミングと位置調整が重要になる。隙間の幅や角度が変化することで難易度が調整される。 |
| リスク   | 隙間にうまく通過できない場合、壁や障害物に衝突してゲームオーバーになるリスクがある。 |
| リワード | 隙間を通過することで得点やボーナスが得られ、特にエッジに近づくほど高得点になることが多い。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-geometry, on_holding-rotate, on_holding-stop, field-auto_scroll |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// clean_robo.js L64-80 より
// 三角形ロボットが壁の隙間を通過するメカニクス
// 三角形ロボットの各頂点を計算
const rps = times(3, (i) => {
  const p = vec(robotRadius)
    .rotate(robot.angle + ((PI * 2) / 3) * i)  // 120度ずつ回転した3頂点
    .add(robot.pos);
  bar(p, 5, 3, ticks * 0.7 + i);  // 頂点を描画
  return p;
});

// 三角形の各辺と壁の衝突判定
color("black");
let icw = false;  // 壁との衝突フラグ
times(3, (i) => {
  const c = line(rps[i], rps[wrap(i + 1, 0, 3)]);  // 辺を描画
  if (c.isColliding.rect.purple) {
    icw = true;  // 壁(紫)に衝突
  }
});

// L48-59: ロボットの回転と移動
if (input.isPressed) {
  robot.speed += 0.3;  // 長押しで加速
} else {
  robot.angle += 0.05 * difficulty;  // 自動回転
  robot.speed += (1 - robot.speed) * 0.2;  // 減速
}
robot.pos.x += robot.vx * robot.speed * difficulty * 0.2;
```

**参考**: `games/src/clean_robo.js`: L48-L80

## 使用例ゲーム

このタグを使用しているゲーム:

- CLEAN ROBO (`games/description/clean_robo.md`)
- SLALOM (`games/description/slalom.md`)