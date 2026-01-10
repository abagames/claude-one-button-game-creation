# on_pressed-go_forward

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: REVOLVE A

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン押下時に意図した方向に前進する |
| 詳細     | 移動方向は時間とともに変化するため、適切なタイミングで方向を決定することが重要になる |
| リスク   | 方向変化のタイミングミスによる障害物との衝突 |
| リワード | 正確なタイミングによる効率的な進行と安全性の確保 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-rotate, field-rotate, rule-time_limit |
| 排他   | player-automatic（自動移動と手動方向決定の競合） |
| 依存   | 特になし |

## 実装例

```js
// revolve_a.js L76-93 より
// ボタン押下で現在の角度の方向に前進
if (input.isJustPressed) {
  play("laser");
  // 現在の角度方向に速度を設定
  arrow.vel.set(1).rotate(arrow.angle);
}
// 壁で反射
if (
  (arrow.pos.x < 3 && arrow.vel.x < 0) ||
  (arrow.pos.x > 97 && arrow.vel.x > 0)
) {
  arrow.vel.x *= -1;
}
if (
  (arrow.pos.y < 3 && arrow.vel.y < 0) ||
  (arrow.pos.y > 97 && arrow.vel.y > 0)
) {
  arrow.vel.y *= -1;
}
arrow.pos.add(vec(arrow.vel).mul(sqrt(difficulty) * 0.4));
// 角度は常に回転し続ける
arrow.angle += 0.08 * sqrt(difficulty);
```

**参考**: `games/src/revolve_a.js`: L76-L93

## 使用例ゲーム

このタグを使用しているゲーム:

- PAINT BALL (`games/description/paint_ball.md`)
- ORBIT MAN (`games/description/orbit_man.md`)
- SUM TEN (`games/description/sum_ten.md`)
- REVOLVE A (`games/description/revolve_a.md`)