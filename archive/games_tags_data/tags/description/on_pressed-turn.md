# on_pressed-turn

**カテゴリ**: on_pressed | **優先度**: high | **代表例**: THUNDER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 方向を変更する。 |
| 詳細     | ボタンを押すことで、方向が90度または180度変わる。または、押した矢印ボタンの方向に回転する可能性がある。 |
| リスク   | 方向転換のタイミングミスで障害物に衝突。複雑な方向管理が必要になる。 |
| リワード | 迅速な方向転換で障害物を回避。戦略的な位置取りでゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-rotate, field-auto_scroll, obstacle-chase |
| 排他   | on_holding-rotate |
| 依存   | - |

## 実装例

```js
// thunder.js L124-132 より
// ボタン押下または画面端到達で方向反転
if (
  input.isJustPressed ||
  (player.x < 0 && player.vx < 0) ||
  (player.x > 99 && player.vx > 0)
) {
  play("laser");
  player.vx *= -1;  // 移動方向を反転
}
player.x += player.vx * sqrt(difficulty);
```

**参考**: `games/src/thunder.js`: L124-L132

## 使用例ゲーム

このタグを使用しているゲーム:

- THUNDER (`games/description/thunder.md`)