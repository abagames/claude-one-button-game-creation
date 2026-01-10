# player-paint

**カテゴリ**: player | **優先度**: low | **代表例**: PAINT BALL

## 概要

| 項目     | 内容                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーがフィールドやオブジェクトを塗る・色を変える                                             |
| 詳細     | プレイヤーの行動や発射物によってグリッドやオブジェクトの色を変化させ、塗った領域によってスコアや効果が変わる |
| リスク   | 敵が塗り返すことで領域を失う、または塗り残しエリアからの攻撃を受ける                               |
| リワード | 効率的な塗りパターンを先読みし、連続塗りでマルチプライヤーを増加させる戦略性が習熟の鍵             |

## タグ相性

| 関係   | タグ                                                   |
| :----- | :----------------------------------------------------- |
| 相性良 | on_pressed-shoot, field-auto_scroll, rule-combo_multiplier |
| 排他   | なし                                                   |
| 依存   | なし                                                   |

## 実装例

```js
// PAINT BALL より抜粋
// ボールがグリッドに接触したとき、グリッドの色をボールの色に塗り替える
if (gx >= 0 && gx < gridCount && gy >= 0 && gy < gridCount + 3) {
  if (b.color === 1 || b.paintingCount > 99 / sqrt(difficulty)) {
    if (b.color === 1 && grid[gx][gy] !== 1) {
      if (grid[gx][gy] === 2) {
        play("laser");
        multiplier++;  // 敵が塗った場所を塗り返すとボーナス
      } else {
        play("hit");
      }
      addScore(multiplier, b.pos);
    }
    grid[gx][gy] = b.color;  // グリッドの色を変更
    b.paintingCount = 0;
  }
}
```

**参考**: `games/src/paint_ball.js`: L156-L170

## 使用例ゲーム

このタグを使用しているゲーム:

- PAINT BALL (`games/description/paint_ball.md`) - 黄色いボールでグリッドを塗り、敵の青いボールが塗り返す
- 5 FLOORS (`games/description/floors_5.md`) - 5色のフロアを飛び移り、着地した床を塗る
