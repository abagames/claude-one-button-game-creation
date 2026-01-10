# player-limited_vision

**カテゴリ**: player | **優先度**: low | **代表例**: DARK CAVE

## 概要

| 項目     | 内容                                                                                       |
| :------- | :----------------------------------------------------------------------------------------- |
| 要約     | プレイヤーの視界が制限されている                                                           |
| 詳細     | 画面の可視範囲が限定され、見えない領域の状況を予測・記憶しながら行動する必要がある         |
| リスク   | 視界外から不意に敵や障害物が接近し、反応する時間がない                                     |
| リワード | 画面外の動きを予測・先読みする能力が習熟の鍵となり、パターン認識力が向上する               |

## タグ相性

| 関係   | タグ                                                 |
| :----- | :--------------------------------------------------- |
| 相性良 | on_holding-shoot, weapon-explosion, field-auto_scroll |
| 排他   | field-3D（広大な視界を前提とするタグ）               |
| 依存   | なし                                                 |

## 実装例

```js
// ZONE B より抜粋
// プレイヤーからの距離に応じて敵の表示/非表示を切り替え
const shownRange = 30;
// ...
const isShown = e.pos.distanceTo(player.pos) < shownRange;
color(isShown ? "red" : "transparent");
const c = char("a", e.pos, { rotation: e.angle }).isColliding;
```

**参考**: `games/src/zone_b.js`: L69, L180-L188

## 使用例ゲーム

このタグを使用しているゲーム:

- ZONE B (`games/description/zone_b.md`) - 周囲30px内の敵と弾のみ表示、視界外は透明化
- MORTAR (`games/description/mortar.md`) - 照準を遠くに伸ばすと画面がスクロールし地上の敵が見えなくなる
- TOTOGE (`games/description/totoge.md`) - 上方の障害物が見えない状態で落下パターンを予測
