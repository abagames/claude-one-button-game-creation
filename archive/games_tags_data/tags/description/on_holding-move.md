# on_holding-move

**カテゴリ**: on_holding | **優先度**: high | **代表例**: BALLS BOMBS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン長押し時に移動する |
| 詳細     | ボタンが押されている間、オブジェクトは移動し、移動速度が上がる。障害物を避けながらプレイヤーキャラクターの位置を技巧的に制御する必要がある |
| リスク   | 移動コントロールのミスによる障害物との衝突 |
| リワード | 精密な位置コントロールによる効率的な進行と安全性の確保 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-auto_scroll, obstacle-bounce, rule-physics |
| 排他   | player-automatic（自動移動と手動移動の競合） |
| 依存   | 特になし |

## 実装例

```js
// balls_bombs.js L133-138 より
// ボタン押下時に移動速度をブースト、押し続けで移動
if (input.isJustPressed) {
  play("laser");
  walkSpeed = 2;  // 速度ブースト
}
// 押している間は移動、離すと停止
playerX += (input.isPressed ? sd * clamp(walkSpeed, 0, 1) : 0) - scr;
walkSpeed *= 0.998;  // 速度は徐々に減衰

// L139-143: プレイヤーキャラクター描画
const c = char(
  addWithCharCode(isBombPlayer ? "g" : "c", floor(ticks / 20) % 2),
  playerX,
  87
).isColliding.char;
```

**参考**: `games/src/balls_bombs.js`: L133-L143

## 使用例ゲーム

このタグを使用しているゲーム:

- SHINY (`games/description/shiny.md`)
- BALL TOUR (`games/description/ball_tour.md`)
- CLEAN ROBO (`games/description/clean_robo.md`)
- ACCEL B (`games/description/accel_b.md`)
- SQUARE BAR (`games/description/square_bar.md`)
- BS FISH (`games/description/bs_fish.md`)
- ANT LION (`games/description/ant_lion.md`)
- LIFT UP (`games/description/lift_up.md`)
- GEOCENT (`games/description/geocent.md`)
- BALLS BOMBS (`games/description/balls_bombs.md`)
- NOT TURN (`games/description/not_turn.md`)
- S LANES (`games/description/s_lanes.md`)
- TWO FACED (`games/description/two_faced.md`)