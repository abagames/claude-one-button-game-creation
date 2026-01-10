# obstacle-bounce

**カテゴリ**: obstacle | **優先度**: low | **代表例**: BALLS BOMBS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 障害物が絶えず跳ね返る。 |
| 詳細     | 跳ね返る障害物を、下からかわすか、飛び越えてかわす。物理的な跳躍軌道を予測する必要がある。 |
| リスク   | 跳躍軌道の予測を誤ると障害物に接触し、ゲームオーバーになる。 |
| リワード | 正確な軌道予測と回避により、高いスコアや生存時間の延長が得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-bounce, weapon-explosion, rule-combo_multiplier | プレイヤーも跳躍することで複雑な軌道の駆け引きが生まれる。爆発と組み合わせることで跳躍物を一掃できる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// balls_bombs.js L156-168 より
// ボールの跳ね返り物理
remove(balls, (b) => {
  b.vel.y += 0.1;  // 重力
  b.pos.add(b.vel.x * sd - scr, b.vel.y * sd);

  // 地面での跳ね返り
  if (b.pos.y > 87 && b.vel.y > 0) {
    play("hit");
    b.vel.y *= -1.01;  // 反発係数 > 1 で徐々に加速
    b.pos.y = 87;
  }
  // 壁での跳ね返り
  if (b.pos.x < 3 && b.vel.x < 0) {
    b.vel.x *= -1.01 * 2;
  }
  if (b.pos.x > 147 && b.vel.x > 0) {
    b.vel.x *= -1.01 / 2;
  }
});
```

**参考**: `games/src/balls_bombs.js`: L156-L168

## 使用例ゲーム

このタグを使用しているゲーム:

- BALLS BOMBS (`games/description/balls_bombs.md`)
- HOPPING P (`games/description/hopping_p.md`)