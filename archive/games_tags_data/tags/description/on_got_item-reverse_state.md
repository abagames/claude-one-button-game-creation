# on_got_item-reverse_state

**カテゴリ**: on_got_item | **優先度**: low | **代表例**: REBIRTH

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | アイテム取得時に属性、ステータス、方向を反転させる |
| 詳細     | 特定のアイテムを取得すると、重力や向きが変化し、別のフィールドに移行できるようになる。プレイヤーはアイテム取得を通じてゲームの状態を変化させる |
| リスク   | アイテム取得のタイミングを誤ると、予期せぬ方向に移動したり、環境との相互作用が逆転してしまう。また、反転後の状態に適応できないとゲームオーバーになる場合がある |
| リワード | 適切なタイミングでアイテムを取得することで、通常では通過できない障害物を回避したり、新しい移動経路を生み出すことができる。連続取得でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-bottomless, player-inverted, field-outpost |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// rebirth.js L162-174 より
// トラック（敵）に当たると反対の世界へ反転
const pw = player.pos.x < 100 ? -1 : 1;  // 現在の世界
color(pw > 0 ? "black" : "white");
const c = char(pc, player.pos, { mirror: { x: pw } }).isColliding.char;
if (c.a && abs(player.vel.x) < 2) {
  // トラックに当たった時
  play("hit");
  // 反対の世界に跳ね飛ばされる
  player.vel.x =
    (player.world > 0 ? -1 : 1) * player.ox * 0.2 * sqrt(difficulty);
  player.world = player.world > 0 ? -1 : 1;  // 世界を反転（1 ⇔ -1）
  player.ox = 10;
  if (multiplier > 1) {
    multiplier--;  // 反転時は倍率減少
  }
}
// 左の世界(x<100)は白背景・白プレイヤー
// 右の世界(x>100)は黒背景・黒プレイヤー
```

**参考**: `games/src/rebirth.js`: L162-L174

## 使用例ゲーム

このタグを使用しているゲーム:

- REBIRTH (`games/description/rebirth.md`) - トラックに当たると反対の世界へ反転
- MIRROR FLOOR (`games/description/mirror_floor.md`) - コイン取得時に重力反転し、上下の世界が入れ替わる
- LIFT UP (`games/description/lift_up.md`) - アイテム取得で重力方向が反転