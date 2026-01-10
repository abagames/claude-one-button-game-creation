# on_pressed-flap

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: SCRAMBIRD

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 羽ばたいて上昇する。 |
| 詳細     | ボタンのタイミングと頻度を調整して障害物を避ける。 |
| リスク   | 羽ばたきのタイミングミスで落下。複雑な羽ばたき制御が必要になる。 |
| リワード | 迅速な羽ばたきで障害物を回避。戦略的な羽ばたき計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-bottomless, obstacle-fall, player-bounce |
| 排他   | on_holding-thrust |
| 依存   | - |

## 実装例

```js
// scrambird.js L125-133 より
// ボタン押下で羽ばたき上昇＋ショットと爆弾発射
color("black");
if (input.isJustPressed) {
  play(fuel > 0 ? "laser" : "hit");
  // 燃料があれば強く上昇、なければ弱く上昇
  ship.vy -= difficulty * (fuel > 0 ? 0.5 : 0.1);
  // 同時にショットと爆弾も発射
  shots.push(vec(ship.pos));
  bombs.push({ pos: vec(ship.pos), vel: vec(2 * sqrt(difficulty), 0) });
}
// 重力で自然に下降
ship.vy += 0.015 * difficulty;
ship.vy *= 0.98;
ship.pos.y += ship.vy;
```

**参考**: `games/src/scrambird.js`: L125-L133

## 使用例ゲーム

このタグを使用しているゲーム:

- SCRAMBIRD (`games/description/scrambird.md`)