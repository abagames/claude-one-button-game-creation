# on_pressed-fall

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: LADDER DROP

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン押下時に落下する |
| 詳細     | 目的の位置にオブジェクトを落とすか、ジャンプ中のキャラクターを即座に地面に落として障害物を回避する |
| リスク   | 予期せぬ落下による障害物との衝突やゲームオーバー |
| リワード | 迅速な位置調整と障害物回避 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-bottomless, obstacle-fall, rule-physics |
| 排他   | on_pressed-jump（ジャンプと落下の競合） |
| 依存   | 特になし |

## 実装例

```js
// ladder_drop.js L146-152 より
// ボタン押下でパネルを落下させるメカニクス
if (p.state === "wait") {
  p.pos.x += pvx * sqrt(difficulty) * 1.5;  // 左右に移動中
  // 壁で反転
  if (p.pos.x < -9) {
    pvx *= -1;
    p.pos.x = -9;
  } else if (p.pos.x > 109 - p.size.x * 6) {
    pvx *= -1;
    p.pos.x = 109 - p.size.x * 6;
  }
  drawPanel(p);
  // ボタン押下でパネルを落下開始
  if (input.isJustPressed) {
    play("select");
    p.state = "drop";
  }
} else if (p.state === "drop") {
  // 落下処理
  p.pos.y += 6 * sqrt(difficulty);
  // 他のパネルに当たったら固定
  // ...
}
```

**参考**: `games/src/ladder_drop.js`: L136-L171

## 使用例ゲーム

このタグを使用しているゲーム:

- REBIRTH (`games/description/rebirth.md`)
- FOOT LASER (`games/description/foot_laser.md`)
- LADDER DROP (`games/description/ladder_drop.md`)